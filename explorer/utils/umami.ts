export const trackEvent = (name: string, data?: Record<string, string>) => {
  // Send a custom event to Umami. Call this from click handlers instead of
  // adding data-umami-event attributes to links: Umami's script forces a full
  // page load for links tagged that way, which breaks client-side routing.
  // window.umami is undefined if the script is blocked or still loading.
  window.umami?.track(name, data)
}
