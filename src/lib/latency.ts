/**
 * Simulated network latency for the mock API.
 *
 * Our data is local, so it would load instantly and the loading states would
 * never show. A short artificial delay makes the app behave like it's
 * talking to a real server, so we can design and test those states.
 */
export function simulateLatency(ms = 700) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
