/**
 * InteractionGuard
 * Transparent overlay that captures and neutralizes stray interactions (clicks, taps, key presses)
 * during the first N milliseconds after page mount. Useful to prevent ghost/double-clicks
 * right after navigation (e.g., when a second click lands on a primary action).
 */

import React from 'react';

interface InteractionGuardProps {
  /** Duration to keep the guard active, in milliseconds. Default: 600 ms */
  durationMs?: number;
  /** z-index of the overlay. Should be above normal content, below modals. Default: 60 */
  zIndex?: number;
}

/**
 * InteractionGuard component
 * - Renders a fixed transparent overlay that intercepts pointer events.
 * - Automatically removes itself after `durationMs`.
 * - Hidden on print (no-print).
 */
const InteractionGuard: React.FC<InteractionGuardProps> = ({ durationMs = 600, zIndex = 60 }) => {
  const [active, setActive] = React.useState(true);

  React.useEffect(() => {
    const t = window.setTimeout(() => setActive(false), durationMs);
    return () => window.clearTimeout(t);
  }, [durationMs]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 no-print"
      role="presentation"
      aria-hidden
      style={{ zIndex, pointerEvents: 'auto', background: 'transparent' }}
      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onMouseUp={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); }}
    />
  );
};

export default InteractionGuard;
