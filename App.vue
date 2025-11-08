<script setup>
import { ref, computed } from 'vue'

// Diesel/Petrol inputs
const mpg = ref('')
const costPerLitre = ref('')

// Electric inputs
const kwhPer100km = ref('')
const costPerKwh = ref('')

// Distance inputs
const distance = ref('')
const distanceUnit = ref('miles')

// Gallon type (US or UK)
const gallonType = ref('UK')

// Conversion constants
const LITRES_PER_UK_GALLON = 4.54609
const LITRES_PER_US_GALLON = 3.78541
const KM_PER_MILE = 1.60934

// Calculate diesel/petrol cost
const dieselCost = computed(() => {
  const dist = parseFloat(distance.value)
  const milesPerGallon = parseFloat(mpg.value)
  const pricePerLitre = parseFloat(costPerLitre.value)

  if (!dist || dist <= 0 || !milesPerGallon || !pricePerLitre || milesPerGallon <= 0 || pricePerLitre <= 0) {
    return null
  }

  // Convert distance to miles if needed
  const distanceInMiles = distanceUnit.value === 'km' ? dist / KM_PER_MILE : dist

  // Calculate gallons needed
  const gallonsNeeded = distanceInMiles / milesPerGallon

  // Convert gallons to litres
  const litresPerGallon = gallonType.value === 'UK' ? LITRES_PER_UK_GALLON : LITRES_PER_US_GALLON
  const litresNeeded = gallonsNeeded * litresPerGallon

  // Calculate cost
  return litresNeeded * pricePerLitre
})

// Calculate electric cost
const electricCost = computed(() => {
  const dist = parseFloat(distance.value)
  const kwhPer100 = parseFloat(kwhPer100km.value)
  const pricePerKwh = parseFloat(costPerKwh.value)

  if (!dist || dist <= 0 || !kwhPer100 || !pricePerKwh || kwhPer100 <= 0 || pricePerKwh <= 0) {
    return null
  }

  // Convert distance to km if needed
  const distanceInKm = distanceUnit.value === 'miles' ? dist * KM_PER_MILE : dist

  // Calculate kWh needed
  const kwhNeeded = (distanceInKm / 100) * kwhPer100

  // Calculate cost
  return kwhNeeded * pricePerKwh
})

// Calculate savings
const savings = computed(() => {
  if (dieselCost.value !== null && electricCost.value !== null) {
    return dieselCost.value - electricCost.value
  }
  return null
})

const savingsPercentage = computed(() => {
  if (dieselCost.value !== null && electricCost.value !== null && dieselCost.value > 0) {
    return (savings.value / dieselCost.value) * 100
  }
  return null
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-12 px-4 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/30 p-8 md:p-12">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            FUEL COST CALCULATOR
          </h1>
          <p class="text-xl text-gray-400 font-light tracking-wide">Compare your journey costs in real-time</p>
        </div>

        <!-- Distance Input -->
        <div class="mb-12 max-w-lg mx-auto">
          <label class="block text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">
            Journey Distance
          </label>
          <div class="flex gap-3">
            <input
              v-model="distance"
              type="number"
              step="0.1"
              min="0"
              class="flex-1 px-6 py-4 bg-gray-800/50 border-2 border-purple-500/50 rounded-xl focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-white text-lg placeholder-gray-500"
              placeholder="100"
            />
            <select
              v-model="distanceUnit"
              class="px-6 py-4 bg-gray-800/50 border-2 border-purple-500/50 rounded-xl focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-white text-lg font-medium cursor-pointer"
            >
              <option value="miles">Miles</option>
              <option value="km">KM</option>
            </select>
          </div>
        </div>

        <!-- Two Column Layout for Vehicle Types -->
        <div class="grid lg:grid-cols-2 gap-8 mb-12">
          <!-- Diesel/Petrol Section -->
          <div class="group relative h-full">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div class="relative bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-500/50 hover:border-orange-400 transition-all h-full flex flex-col">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-3xl font-black text-orange-400 flex items-center">
                  <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  DIESEL/PETROL
                </h2>
              </div>

              <div class="space-y-5">
                <div>
                  <label class="block text-xs font-bold text-orange-300 mb-2 uppercase tracking-wider">
                    Miles per Gallon (MPG)
                  </label>
                  <input
                    v-model="mpg"
                    type="number"
                    step="0.1"
                    min="0"
                    class="w-full px-5 py-4 bg-gray-900/70 border-2 border-orange-500/50 rounded-xl focus:ring-4 focus:ring-orange-500/50 focus:border-orange-400 transition-all text-white text-lg placeholder-gray-600"
                    placeholder="45.0"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-orange-300 mb-2 uppercase tracking-wider">
                    Cost per Litre
                  </label>
                  <input
                    v-model="costPerLitre"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full px-5 py-4 bg-gray-900/70 border-2 border-orange-500/50 rounded-xl focus:ring-4 focus:ring-orange-500/50 focus:border-orange-400 transition-all text-white text-lg placeholder-gray-600"
                    placeholder="1.45"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-orange-300 mb-3 uppercase tracking-wider">Gallon Type</label>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      @click="gallonType = 'UK'"
                      :class="[
                        'py-3 px-5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all transform hover:scale-105',
                        gallonType === 'UK'
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                          : 'bg-gray-700/50 text-gray-400 border-2 border-gray-600 hover:border-orange-500/50'
                      ]"
                    >
                      UK
                    </button>
                    <button
                      @click="gallonType = 'US'"
                      :class="[
                        'py-3 px-5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all transform hover:scale-105',
                        gallonType === 'US'
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                          : 'bg-gray-700/50 text-gray-400 border-2 border-gray-600 hover:border-orange-500/50'
                      ]"
                    >
                      US
                    </button>
                  </div>
                </div>
              </div>

              <!-- Diesel Cost Display -->
              <div class="mt-auto pt-8">
                <div
                  v-if="dieselCost !== null"
                  class="relative p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-2xl shadow-orange-500/50 transform hover:scale-105 transition-transform"
                >
                  <div class="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl blur opacity-50 animate-pulse"></div>
                  <div class="relative">
                    <p class="text-xs font-bold text-orange-100 mb-1 uppercase tracking-widest">Journey Cost</p>
                    <p class="text-5xl font-black text-white drop-shadow-lg">{{ dieselCost.toFixed(2) }}</p>
                  </div>
                </div>
                <div
                  v-else
                  class="p-6 bg-gray-800/50 rounded-xl text-gray-500 text-center border-2 border-dashed border-gray-700"
                >
                  <p class="text-sm font-medium uppercase tracking-wider">Enter values</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Electric Section -->
          <div class="group relative h-full">
            <div class="absolute inset-0 bg-gradient-to-br from-cyan-500 to-lime-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div class="relative bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-cyan-500/50 hover:border-cyan-400 transition-all h-full flex flex-col">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-3xl font-black text-cyan-400 flex items-center">
                  <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  ELECTRIC
                </h2>
              </div>

              <div class="space-y-5">
                <div>
                  <label class="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">
                    kWh per 100 km
                  </label>
                  <input
                    v-model="kwhPer100km"
                    type="number"
                    step="0.1"
                    min="0"
                    class="w-full px-5 py-4 bg-gray-900/70 border-2 border-cyan-500/50 rounded-xl focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all text-white text-lg placeholder-gray-600"
                    placeholder="15.5"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wider">
                    Cost per kWh
                  </label>
                  <input
                    v-model="costPerKwh"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full px-5 py-4 bg-gray-900/70 border-2 border-cyan-500/50 rounded-xl focus:ring-4 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all text-white text-lg placeholder-gray-600"
                    placeholder="0.28"
                  />
                </div>
              </div>

              <!-- Electric Cost Display -->
              <div class="mt-auto pt-8">
                <div
                  v-if="electricCost !== null"
                  class="relative p-6 bg-gradient-to-br from-cyan-500 to-lime-500 rounded-xl shadow-2xl shadow-cyan-500/50 transform hover:scale-105 transition-transform"
                >
                  <div class="absolute inset-0 bg-gradient-to-br from-cyan-400 to-lime-400 rounded-xl blur opacity-50 animate-pulse"></div>
                  <div class="relative">
                    <p class="text-xs font-bold text-cyan-100 mb-1 uppercase tracking-widest">Journey Cost</p>
                    <p class="text-5xl font-black text-white drop-shadow-lg">{{ electricCost.toFixed(2) }}</p>
                  </div>
                </div>
                <div
                  v-else
                  class="p-6 bg-gray-800/50 rounded-xl text-gray-500 text-center border-2 border-dashed border-gray-700"
                >
                  <p class="text-sm font-medium uppercase tracking-wider">Enter values</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparison Display -->
        <div
          v-if="dieselCost !== null && electricCost !== null"
          class="relative group"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
          <div class="relative bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-500/50">
            <h3 class="text-3xl font-black mb-8 text-center bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider">
              Cost Comparison
            </h3>
            <div class="grid md:grid-cols-3 gap-6">
              <div class="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 text-center transform hover:scale-105 transition-transform">
                <p class="text-xs font-bold text-orange-300 mb-2 uppercase tracking-widest">Diesel/Petrol</p>
                <p class="text-4xl font-black text-white drop-shadow-lg">{{ dieselCost.toFixed(2) }}</p>
              </div>
              <div class="bg-gradient-to-br from-cyan-500/20 to-lime-500/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30 text-center transform hover:scale-105 transition-transform">
                <p class="text-xs font-bold text-cyan-300 mb-2 uppercase tracking-widest">Electric</p>
                <p class="text-4xl font-black text-white drop-shadow-lg">{{ electricCost.toFixed(2) }}</p>
              </div>
              <div class="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-pink-500/30 text-center transform hover:scale-105 transition-transform">
                <p class="text-xs font-bold text-pink-300 mb-2 uppercase tracking-widest">
                  {{ savings > 0 ? 'You Save' : 'Extra Cost' }}
                </p>
                <p class="text-4xl font-black text-white drop-shadow-lg">
                  {{ Math.abs(savings).toFixed(2) }}
                </p>
                <p v-if="savingsPercentage !== null" class="text-sm font-bold text-pink-200 mt-2">
                  {{ Math.abs(savingsPercentage).toFixed(1) }}% {{ savings > 0 ? 'cheaper' : 'more' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}
</style>
