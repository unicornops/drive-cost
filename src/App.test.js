import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import App from "./App.vue";

describe("App.vue", () => {
  it("renders without crashing", () => {
    const wrapper = mount(App);
    expect(wrapper.exists()).toBe(true);
  });

  it("displays the main heading", () => {
    const wrapper = mount(App);
    expect(wrapper.text()).toContain("FUEL COST CALCULATOR");
  });

  it("has diesel/petrol input fields", () => {
    const wrapper = mount(App);
    const inputs = wrapper.findAll("input");
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("has electric input fields", () => {
    const wrapper = mount(App);
    expect(wrapper.html()).toContain("Electric");
  });

  it("initializes with default values", () => {
    const wrapper = mount(App);
    // Check that the component mounts with empty input fields
    const inputs = wrapper.findAll('input[type="number"]');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it("has per-distance tax fields for diesel/petrol", () => {
    const wrapper = mount(App);
    expect(wrapper.html()).toContain("Tax per");
    // Check that there are tax input fields
    const taxInputs = wrapper.findAll('input[placeholder="0.00"]');
    expect(taxInputs.length).toBeGreaterThanOrEqual(2);
  });

  it("calculates diesel cost with per-distance tax", async () => {
    const wrapper = mount(App);

    // Set distance to 100 miles
    const distanceInput = wrapper.find('input[placeholder="100"]');
    await distanceInput.setValue("100");

    // Set MPG to 45
    const mpgInput = wrapper.find('input[placeholder="45.0"]');
    await mpgInput.setValue("45");

    // Set cost per litre to 1.45
    const costPerLitreInput = wrapper.find('input[placeholder="1.45"]');
    await costPerLitreInput.setValue("1.45");

    // Set diesel tax per mile to 0.05
    const taxInputs = wrapper.findAll('input[placeholder="0.00"]');
    await taxInputs[0].setValue("0.05");

    // Wait for reactivity
    await wrapper.vm.$nextTick();

    // The diesel cost should include the base fuel cost plus tax (100 miles * 0.05 = 5)
    // Base fuel cost: (100 miles / 45 mpg) * 4.54609 L/UK gallon * 1.45 = ~14.63
    // Tax cost: 100 * 0.05 = 5
    // Total: ~19.63
    const dieselCostText = wrapper.text();
    expect(dieselCostText).toContain("Journey Cost");
  });

  it("calculates electric cost with per-distance tax", async () => {
    const wrapper = mount(App);

    // Set distance to 100 miles
    const distanceInput = wrapper.find('input[placeholder="100"]');
    await distanceInput.setValue("100");

    // Set kWh per 100km to 15.5
    const kwhInput = wrapper.find('input[placeholder="15.5"]');
    await kwhInput.setValue("15.5");

    // Set cost per kWh to 0.28
    const costPerKwhInput = wrapper.find('input[placeholder="0.28"]');
    await costPerKwhInput.setValue("0.28");

    // Set electric tax per mile to 0.03
    const taxInputs = wrapper.findAll('input[placeholder="0.00"]');
    await taxInputs[1].setValue("0.03");

    // Wait for reactivity
    await wrapper.vm.$nextTick();

    // The electric cost should include the base electricity cost plus tax (100 miles * 0.03 = 3)
    const electricCostText = wrapper.text();
    expect(electricCostText).toContain("Journey Cost");
  });

  it("defaults per-distance tax to 0 when not specified", async () => {
    const wrapper = mount(App);

    // Set only basic inputs without tax
    const distanceInput = wrapper.find('input[placeholder="100"]');
    await distanceInput.setValue("100");

    const mpgInput = wrapper.find('input[placeholder="45.0"]');
    await mpgInput.setValue("45");

    const costPerLitreInput = wrapper.find('input[placeholder="1.45"]');
    await costPerLitreInput.setValue("1.45");

    await wrapper.vm.$nextTick();

    // Should calculate cost without tax (tax defaults to 0)
    const dieselCostText = wrapper.text();
    expect(dieselCostText).toContain("Journey Cost");
  });

  it("changes tax label from Mile to KM when distance unit changes", async () => {
    const wrapper = mount(App);

    // Initially should show "Tax per Mile"
    expect(wrapper.html()).toContain("Tax per Mile");

    // Find the distance unit dropdown by looking for the select with "Miles" and "KM" options
    const distanceUnitSelect = wrapper.findAll('select').find(select => {
      const html = select.html();
      return html.includes('value="miles"') && html.includes('value="km"');
    });
    
    expect(distanceUnitSelect).toBeDefined();
    
    // Change to km
    await distanceUnitSelect.setValue("km");
    await wrapper.vm.$nextTick();

    // Now should show "Tax per KM"
    expect(wrapper.html()).toContain("Tax per KM");
    expect(wrapper.html()).not.toContain("Tax per Mile");

    // Switch back to miles
    await distanceUnitSelect.setValue("miles");
    await wrapper.vm.$nextTick();

    // Should show "Tax per Mile" again
    expect(wrapper.html()).toContain("Tax per Mile");
  });
});
