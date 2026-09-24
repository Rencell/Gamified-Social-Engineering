import '@testing-library/jest-dom/vitest'

// Note: avoid registering Vitest lifecycle hooks in setup files.
// Basic stubs frequently needed in component tests
if (!('scrollTo' in window)) {
  // @ts-expect-error - test stub
  window.scrollTo = () => {}
}

if (!('matchMedia' in window)) {
  // @ts-expect-error - test stub
  window.matchMedia = () =>
    ({
      matches: false,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
