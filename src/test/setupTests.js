/**
 * Test setup file
 * - Imports jest-dom matchers for richer DOM assertions
 * - Adds small browser API shims useful for testing Vue components in jsdom
 *
 * This file is referenced by Vitest via `setupFiles` in vitest.config.js
 */

import '@testing-library/jest-dom'

// Basic window.matchMedia shim for components that check media queries
if (typeof window !== 'undefined' && !window.matchMedia) {
  // Minimal mock implementation used in many component libraries
  window.matchMedia = (query) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated
      removeListener: () => {}, // deprecated
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }
  }
}

// Minimal ResizeObserver shim for components that use it
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  class ResizeObserver {
    constructor(callback) {
      this._cb = callback
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-ignore
  window.ResizeObserver = ResizeObserver
}

// Optionally add any other globals you need for tests below.
// For example, if your components expect `fetch`, you could add a lightweight polyfill here.
// Keep shims minimal to avoid masking real issues.
