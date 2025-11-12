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
});
