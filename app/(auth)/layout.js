/* ──────────────────────────────────────────────────────────
   Auth Route Group Layout
   Overrides the root layout for /sign-in and /sign-up so
   the Navbar is hidden on authentication pages — users
   shouldn't see app nav before they're authenticated.
────────────────────────────────────────────────────────── */

export default function AuthLayout({ children }) {
  return <>{children}</>;
}
