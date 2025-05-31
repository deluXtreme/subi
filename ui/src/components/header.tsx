import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Header component
 *
 * Layout:
 * ┌─ title ─────────────────────────────┐  ConnectButton ─┐
 * │  Subscription Manager               │                 │
 * └─────────────────────────────────────┴─────────────────┘
 */
export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      {/* Left: title */}
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold tracking-wide text-gray-900">
          Subscription Manager
        </h1>
      </div>

      {/* Right: Wallet connect */}
      <ConnectButton showBalance={false} chainStatus="icon" />
    </header>
  );
}