/*
 * A pretend "signed in" state for the portal demo, stored in this browser.
 * There is NO real authentication. Real auth needs a secure backend,
 * hashed passwords, and HIPAA-grade safeguards, which are out of scope for a
 * front-end portfolio project and deliberately left out.
 */
const KEY = "northstar:demo-session";

export type DemoSession = { name: string; email: string };

export function getSession(): DemoSession | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DemoSession) : null;
  } catch {
    return null;
  }
}

export function startSession(session: DemoSession) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable; the demo still continues for this page view */
  }
}

export function endSession() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
