/**
 * Visibility utilities for print and screen.
 * Provides a simple wrapper to show/hide content based on the target medium.
 */

import React from 'react';

interface VisibilityProps {
  /** Mode: show only on 'screen', only on 'print', or 'both' (default). */
  mode?: 'screen' | 'print' | 'both';
  /** Optional className for extra styling. */
  className?: string;
  /** Content to render. */
  children?: React.ReactNode;
}

/**
 * Internal helper: concatenates classNames.
 */
function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

/**
 * Visibility component:
 * - mode="print" => visible only on print (adds class 'only-print')
 * - mode="screen" => visible only on screen (adds class 'no-print')
 * - mode="both" => visible on both
 */
export const Visibility: React.FC<VisibilityProps> = ({ mode = 'both', className, children }) => {
  const mapped =
    mode === 'print' ? 'only-print' :
    mode === 'screen' ? 'no-print' : '';

  return <div className={cx(mapped, className)}>{children}</div>;
};

/**
 * Shorthand wrappers for convenience.
 */
export const PrintOnly: React.FC<Omit<VisibilityProps, 'mode'>> = (props) => (
  <Visibility mode="print" {...props} />
);

export const ScreenOnly: React.FC<Omit<VisibilityProps, 'mode'>> = (props) => (
  <Visibility mode="screen" {...props} />
);