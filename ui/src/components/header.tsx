import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ThemeToggle } from "./theme-toggle";

/**
 * Header component
 *
 * Layout:
 * ┌─ title ─────────────────────────────┐ Toggle | ConnectButton ─┐
 * │  Subi                               │   🌙   |                │
 * └─────────────────────────────────────┴────────┴────────────────┘
 */
export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm dark:border-gray-600">
      {/* Left: title */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight text-circles-primary">
          Subi
        </h1>
      </div>

      {/* Right: Theme toggle and Wallet connect */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <ConnectButton showBalance={false} chainStatus="icon" />
      </div>
    </header>
  );
}