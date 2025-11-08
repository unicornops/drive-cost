<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Footer from "./components/Footer.vue";

// Diesel/Petrol inputs
const mpg = ref("");
const costPerLitre = ref("");

// Electric inputs
const kwhPer100km = ref("");
const costPerKwh = ref("");

// Distance inputs
const distance = ref("");
const distanceUnit = ref("miles");

// Gallon type (US or UK)
const gallonType = ref("UK");

// Fuel efficiency metric type (MPG or L/100km)
const fuelMetricType = ref("MPG");

// Electric efficiency metric type (kWh/100km or MPGe)
const electricMetricType = ref("kWh/100km");

// Conversion constants
const LITRES_PER_UK_GALLON = 4.54609;
const LITRES_PER_US_GALLON = 3.78541;
const KM_PER_MILE = 1.60934;
const KWH_PER_GALLON_EQUIVALENT = 33.7; // EPA standard for MPGe

// Calculate diesel/petrol cost
const dieselCost = computed(() => {
  const dist = parseFloat(distance.value);
  const fuelEfficiency = parseFloat(mpg.value);
  const pricePerLitre = parseFloat(costPerLitre.value);

  if (
    !dist ||
    dist <= 0 ||
    !fuelEfficiency ||
    !pricePerLitre ||
    fuelEfficiency <= 0 ||
    pricePerLitre <= 0
  ) {
    return null;
  }

  let litresNeeded;

  if (fuelMetricType.value === "MPG") {
    // Convert distance to miles if needed
    const distanceInMiles =
      distanceUnit.value === "km" ? dist / KM_PER_MILE : dist;

    // Calculate gallons needed
    const gallonsNeeded = distanceInMiles / fuelEfficiency;

    // Convert gallons to litres
    const litresPerGallon =
      gallonType.value === "UK" ? LITRES_PER_UK_GALLON : LITRES_PER_US_GALLON;
    litresNeeded = gallonsNeeded * litresPerGallon;
  } else {
    // L/100km mode
    // Convert distance to km if needed
    const distanceInKm =
      distanceUnit.value === "miles" ? dist * KM_PER_MILE : dist;

    // Calculate litres needed
    litresNeeded = (distanceInKm / 100) * fuelEfficiency;
  }

  // Calculate cost
  return litresNeeded * pricePerLitre;
});

// Calculate electric cost
const electricCost = computed(() => {
  const dist = parseFloat(distance.value);
  const efficiency = parseFloat(kwhPer100km.value);
  const pricePerKwh = parseFloat(costPerKwh.value);

  if (
    !dist ||
    dist <= 0 ||
    !efficiency ||
    !pricePerKwh ||
    efficiency <= 0 ||
    pricePerKwh <= 0
  ) {
    return null;
  }

  let kwhNeeded;

  if (electricMetricType.value === "kWh/100km") {
    // kWh per 100km mode
    // Convert distance to km if needed
    const distanceInKm =
      distanceUnit.value === "miles" ? dist * KM_PER_MILE : dist;

    // Calculate kWh needed
    kwhNeeded = (distanceInKm / 100) * efficiency;
  } else {
    // MPGe mode
    // Convert distance to miles if needed
    const distanceInMiles =
      distanceUnit.value === "km" ? dist / KM_PER_MILE : dist;

    // Calculate kWh needed
    // MPGe = miles / (kWh / 33.7)
    // Therefore: kWh = (miles / MPGe) * 33.7
    kwhNeeded = (distanceInMiles / efficiency) * KWH_PER_GALLON_EQUIVALENT;
  }

  // Calculate cost
  return kwhNeeded * pricePerKwh;
});

// Calculate savings
const savings = computed(() => {
  if (dieselCost.value !== null && electricCost.value !== null) {
    return dieselCost.value - electricCost.value;
  }
  return null;
});

const savingsPercentage = computed(() => {
  if (
    dieselCost.value !== null &&
    electricCost.value !== null &&
    dieselCost.value > 0
  ) {
    return (savings.value / dieselCost.value) * 100;
  }
  return null;
});

// URL sharing functionality
const shareUrl = ref("");
const showCopiedMessage = ref(false);
let updateUrlTimeout = null;

// Update URL with current state
const updateUrl = () => {
  const params = new URLSearchParams();

  if (distance.value) params.set("distance", distance.value);
  if (distanceUnit.value) params.set("distanceUnit", distanceUnit.value);
  if (mpg.value) params.set("mpg", mpg.value);
  if (costPerLitre.value) params.set("costPerLitre", costPerLitre.value);
  if (kwhPer100km.value) params.set("kwhPer100km", kwhPer100km.value);
  if (costPerKwh.value) params.set("costPerKwh", costPerKwh.value);
  if (gallonType.value) params.set("gallonType", gallonType.value);
  if (fuelMetricType.value) params.set("fuelMetricType", fuelMetricType.value);
  if (electricMetricType.value)
    params.set("electricMetricType", electricMetricType.value);

  const queryString = params.toString();
  const newUrl = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;

  // Update browser URL without reload
  window.history.replaceState({}, "", newUrl);
  shareUrl.value = window.location.href;
};

// Debounced version of updateUrl
const debouncedUpdateUrl = () => {
  if (updateUrlTimeout) {
    clearTimeout(updateUrlTimeout);
  }
  updateUrlTimeout = setTimeout(() => {
    updateUrl();
  }, 500); // Wait 500ms after last keystroke
};

// Load values from URL on mount
const loadFromUrl = () => {
  const params = new URLSearchParams(window.location.search);

  // Parse numeric values
  if (params.has("distance")) {
    const value = parseFloat(params.get("distance"));
    if (!isNaN(value)) distance.value = value.toString();
  }
  if (params.has("mpg")) {
    const value = parseFloat(params.get("mpg"));
    if (!isNaN(value)) mpg.value = value.toString();
  }
  if (params.has("costPerLitre")) {
    const value = parseFloat(params.get("costPerLitre"));
    if (!isNaN(value)) costPerLitre.value = value.toString();
  }
  if (params.has("kwhPer100km")) {
    const value = parseFloat(params.get("kwhPer100km"));
    if (!isNaN(value)) kwhPer100km.value = value.toString();
  }
  if (params.has("costPerKwh")) {
    const value = parseFloat(params.get("costPerKwh"));
    if (!isNaN(value)) costPerKwh.value = value.toString();
  }

  // String values don't need parsing
  if (params.has("distanceUnit"))
    distanceUnit.value = params.get("distanceUnit");
  if (params.has("gallonType")) gallonType.value = params.get("gallonType");
  if (params.has("fuelMetricType"))
    fuelMetricType.value = params.get("fuelMetricType");
  if (params.has("electricMetricType"))
    electricMetricType.value = params.get("electricMetricType");

  shareUrl.value = window.location.href;
};

// Copy share URL to clipboard
const copyShareUrl = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    showCopiedMessage.value = true;
    setTimeout(() => {
      showCopiedMessage.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

// Watch all inputs and update URL (debounced for text inputs, immediate for dropdowns)
watch([distance, mpg, costPerLitre, kwhPer100km, costPerKwh], () => {
  debouncedUpdateUrl();
});

// For dropdown/toggle changes, update immediately
watch([distanceUnit, gallonType, fuelMetricType, electricMetricType], () => {
  updateUrl();
});

// Load from URL on mount
onMounted(() => {
  loadFromUrl();
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-6 sm:py-12 px-3 sm:px-4 relative overflow-hidden"
  >
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 2s"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div
        class="bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-purple-500/30 p-4 sm:p-8 md:p-12"
      >
        <!-- Header -->
        <div class="text-center mb-6 sm:mb-12">
          <h1
            class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient leading-tight"
          >
            FUEL COST CALCULATOR
          </h1>
          <p
            class="text-base sm:text-xl text-gray-400 font-light tracking-wide"
          >
            Compare your journey costs with different fuel types and prices.
          </p>
        </div>

        <!-- Distance Input -->
        <div class="mb-6 sm:mb-12 max-w-lg mx-auto">
          <label
            class="block text-xs sm:text-sm font-bold text-cyan-400 mb-2 sm:mb-3 uppercase tracking-wider"
          >
            Journey Distance
          </label>
          <div class="flex gap-2 sm:gap-3">
            <input
              v-model="distance"
              type="number"
              step="0.1"
              min="0"
              class="flex-1 px-3 sm:px-6 py-3 sm:py-4 bg-gray-800/50 border-2 border-purple-500/50 rounded-xl focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-white text-base sm:text-lg placeholder-gray-500"
              placeholder="100"
            />
            <select
              v-model="distanceUnit"
              class="px-3 sm:px-6 py-3 sm:py-4 bg-gray-800/50 border-2 border-purple-500/50 rounded-xl focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-white text-base sm:text-lg font-medium cursor-pointer"
            >
              <option value="miles">Miles</option>
              <option value="km">KM</option>
            </select>
          </div>
        </div>

        <!-- Two Column Layout for Vehicle Types -->
        <div class="grid lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-12">
          <!-- Diesel/Petrol Section -->
          <div class="group relative h-full">
            <div
              class="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
            ></div>
            <div
              class="relative bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 border-2 border-orange-500/50 hover:border-orange-400 transition-all h-full flex flex-col"
            >
              <div class="flex items-center justify-between mb-4 sm:mb-6">
                <h2
                  class="text-xl sm:text-2xl md:text-3xl font-black text-orange-400 flex items-center"
                >
                  <svg
                    class="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                  DIESEL/PETROL
                </h2>
              </div>

              <div class="space-y-3 sm:space-y-5">
                <div>
                  <label
                    class="block text-xs font-bold text-orange-300 mb-2 sm:mb-3 uppercase tracking-wider"
                    >Fuel Efficiency Metric</label
                  >
                  <div class="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      @click="fuelMetricType = 'MPG'"
                      :class="[
                        'py-2 sm:py-3 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-105',
                        fuelMetricType === 'MPG'
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                          : 'bg-gray-700/50 text-gray-400 border-2 border-gray-600 hover:border-orange-500/50',
                      ]"
                    >
                      MPG
                    </button>
                    <button
                      @click="fuelMetricType = 'L/100km'"
                      :class="[
                        'py-2 sm:py-3 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-105',
                        fuelMetricType === 'L/100km'
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                          : 'bg-gray-700/50 text-gray-400 border-2 border-gray-600 hover:border-orange-500/50',
                      ]"
                    >
                      L/100km
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-orange-300 mb-2 uppercase tracking-wider"
                  >
                    {{
                      fuelMetricType === "MPG"
                        ? "Miles per Gallon (MPG)"
                        : "Litres per 100 km"
                    }}
                  </label>
                  <input
                    v-model="mpg"
                    type="number"
                    step="0.1"
                    min="0"
                    class="w-full px-3 sm:px-5 py-3 sm:py-4 bg-gray-900/70 border-2 border-orange-500/50 rounded-xl focus:ring-4 focus:ring-orange-500/50 focus:border-orange-400 transition-all text-white text-base sm:text-lg placeholder-gray-600"
                    :placeholder="fuelMetricType === 'MPG' ? '45.0' : '6.5'"
                  />
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-orange-300 mb-2 uppercase tracking-wider"
                  >
                    Cost per Litre
                  </label>
                  <input
                    v-model="costPerLitre"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full px-3 sm:px-5 py-3 sm:py-4 bg-gray-900/70 border-2 border-orange-500/50 rounded-xl focus:ring-4 focus:ring-orange-500/50 focus:border-orange-400 transition-all text-white text-base sm:text-lg placeholder-gray-600"
                    placeholder="1.45"
                  />
                </div>

                <div v-if="fuelMetricType === 'MPG'">
                  <label
                    class="block text-xs font-bold text-orange-300 mb-2 sm:mb-3 uppercase tracking-wider"
                    >Gallon Type</label
                  >
                  <div class="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      @click="gallonType = 'UK'"
                      :class="[
                        'py-2 sm:py-3 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-105',
                        gallonType === 'UK'
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                          : 'bg-gray-700/50 text-gray-400 border-2 border-gray-600 hover:border-orange-500/50',
                      ]"
                    >
                      UK
                    </button>
                    <button
                      @click="gallonType = 'US'"
                      :class="[
                        'py-2 sm:py-3 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-105',
                        gallonType === 'US'
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                          : 'bg-gray-700/50 text-gray-400 border-2 border-gray-600 hover:border-orange-500/50',
                      ]"
                    >
                      US
                    </button>
                  </div>
                </div>
              </div>

              <!-- Diesel Cost Display -->
              <div class="mt-auto pt-4 sm:pt-8">
                <div
                  v-if="dieselCost !== null"
                  class="relative p-4 sm:p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-2xl shadow-orange-500/50 transform hover:scale-105 transition-transform"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl blur opacity-50 animate-pulse"
                  ></div>
                  <div class="relative">
                    <p
                      class="text-xs font-bold text-orange-100 mb-1 uppercase tracking-widest"
                    >
                      Journey Cost
                    </p>
                    <p
                      class="text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-lg"
                    >
                      {{ dieselCost.toFixed(2) }}
                    </p>
                  </div>
                </div>
                <div
                  v-else
                  class="p-4 sm:p-6 bg-gray-800/50 rounded-xl text-gray-500 text-center border-2 border-dashed border-gray-700"
                >
                  <p
                    class="text-xs sm:text-sm font-medium uppercase tracking-wider"
                  >
                    Enter values
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Electric Section -->
          <div class="group relative h-full">
            <div
              class="absolute inset-0 bg-gradient-to-br from-cyan-500 to-lime-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
            ></div>
            <div
              class="relative bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 border-2 border-cyan-500/50 hover:border-cyan-400 transition-all h-full flex flex-col"
            >
              <div class="flex items-center justify-between mb-4 sm:mb-6">
                <h2
                  class="text-xl sm:text-2xl md:text-3xl font-black text-cyan-400 flex items-center"
                >
                  <svg
                    class="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                  ELECTRIC
                </h2>
              </div>

              <div class="space-y-3 sm:space-y-5">
                <div>
                  <label
                    class="block text-xs font-bold text-cyan-300 mb-2 sm:mb-3 uppercase tracking-wider"
                    >Efficiency Metric</label
                  >
                  <div class="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      @click="electricMetricType = 'kWh/100km'"
                      :class="[
                        'py-2 sm:py-3 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-105',
                        electricMetricType === 'kWh/100km'
                          ? 'bg-gradient-to-r from-cyan-500 to-lime-500 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-gray-700/50 text-gray-400 border-2 border-gray-600 hover:border-cyan-500/50',
                      ]"
                    >
                      kWh/100km
                    </button>
                    <button
                      @click="electricMetricType = 'MPGe'"
                      :class="[
                        'py-2 sm:py-3 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all transform hover:scale-105',
                        electricMetricType === 'MPGe'
                          ? 'bg-gradient-to-r from-cyan-500 to-lime-500 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-gray-700/50 text-gray-400 border-2 border-gray-600 hover:border-cyan-500/50',
                      ]"
                    >
                      MPGe
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider"
                  >
                    {{
                      electricMetricType === "kWh/100km"
                        ? "kWh per 100 km"
                        : "Miles per Gallon equivalent (MPGe)"
                    }}
                  </label>
                  <input
                    v-model="kwhPer100km"
                    type="number"
                    step="0.1"
                    min="0"
                    class="w-full px-3 sm:px-5 py-3 sm:py-4 bg-gray-900/70 border-2 border-cyan-500/50 rounded-xl focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all text-white text-base sm:text-lg placeholder-gray-600"
                    :placeholder="
                      electricMetricType === 'kWh/100km' ? '15.5' : '100'
                    "
                  />
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider"
                  >
                    Cost per kWh
                  </label>
                  <input
                    v-model="costPerKwh"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full px-3 sm:px-5 py-3 sm:py-4 bg-gray-900/70 border-2 border-cyan-500/50 rounded-xl focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all text-white text-base sm:text-lg placeholder-gray-600"
                    placeholder="0.28"
                  />
                </div>
              </div>

              <!-- Electric Cost Display -->
              <div class="mt-auto pt-4 sm:pt-8">
                <div
                  v-if="electricCost !== null"
                  class="relative p-4 sm:p-6 bg-gradient-to-br from-cyan-500 to-lime-500 rounded-xl shadow-2xl shadow-cyan-500/50 transform hover:scale-105 transition-transform"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-cyan-400 to-lime-400 rounded-xl blur opacity-50 animate-pulse"
                  ></div>
                  <div class="relative">
                    <p
                      class="text-xs font-bold text-cyan-100 mb-1 uppercase tracking-widest"
                    >
                      Journey Cost
                    </p>
                    <p
                      class="text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-lg"
                    >
                      {{ electricCost.toFixed(2) }}
                    </p>
                  </div>
                </div>
                <div
                  v-else
                  class="p-4 sm:p-6 bg-gray-800/50 rounded-xl text-gray-500 text-center border-2 border-dashed border-gray-700"
                >
                  <p
                    class="text-xs sm:text-sm font-medium uppercase tracking-wider"
                  >
                    Enter values
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparison Display -->
        <div
          v-if="dieselCost !== null && electricCost !== null"
          class="relative group mb-6 sm:mb-8"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"
          ></div>
          <div
            class="relative bg-gray-800/90 backdrop-blur-sm p-4 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-purple-500/50"
          >
            <h3
              class="text-xl sm:text-2xl md:text-3xl font-black mb-4 sm:mb-8 text-center bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider"
            >
              Cost Comparison
            </h3>
            <div class="grid md:grid-cols-3 gap-3 sm:gap-6">
              <div
                class="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-orange-500/30 text-center transform hover:scale-105 transition-transform"
              >
                <p
                  class="text-xs font-bold text-orange-300 mb-2 uppercase tracking-widest"
                >
                  Diesel/Petrol
                </p>
                <p
                  class="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg"
                >
                  {{ dieselCost.toFixed(2) }}
                </p>
              </div>
              <div
                class="bg-gradient-to-br from-cyan-500/20 to-lime-500/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-cyan-500/30 text-center transform hover:scale-105 transition-transform"
              >
                <p
                  class="text-xs font-bold text-cyan-300 mb-2 uppercase tracking-widest"
                >
                  Electric
                </p>
                <p
                  class="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg"
                >
                  {{ electricCost.toFixed(2) }}
                </p>
              </div>
              <div
                class="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-pink-500/30 text-center transform hover:scale-105 transition-transform"
              >
                <p
                  class="text-xs font-bold text-pink-300 mb-2 uppercase tracking-widest"
                >
                  {{ savings > 0 ? "You Save" : "Extra Cost" }}
                </p>
                <p
                  class="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg"
                >
                  {{ Math.abs(savings).toFixed(2) }}
                </p>
                <p
                  v-if="savingsPercentage !== null"
                  class="text-xs sm:text-sm font-bold text-pink-200 mt-2"
                >
                  {{ Math.abs(savingsPercentage).toFixed(1) }}%
                  {{ savings > 0 ? "cheaper" : "more" }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Share Button -->
        <div class="text-center">
          <button
            @click="copyShareUrl"
            class="relative inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all transform hover:scale-105 active:scale-95 uppercase tracking-wider"
          >
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              ></path>
            </svg>
            <span v-if="!showCopiedMessage">Share Results</span>
            <span v-else class="flex items-center">
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Link Copied!
            </span>
          </button>
          <p class="text-xs sm:text-sm text-gray-400 mt-3 sm:mt-4">
            Click to copy a shareable link with your current settings
          </p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<style scoped>
@keyframes gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}
</style>
