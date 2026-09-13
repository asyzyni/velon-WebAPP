// Velon's wordmark: the name in Manrope 800, plus one flourish — a dot after it.
// The idea: a booking isn't real until it's confirmed, and the dot is what confirms it.
// That dot also works completely on its own (see the `mark` prop) — as a favicon,
// an app icon, or anywhere the full wordmark won't fit.
//
// Requires the Manrope font to be loaded (see index.html's <link> to Google Fonts);
// falls back to the app's system font stack if it isn't available yet.

interface LogoProps {
  /** Color treatment: `brand` for light backgrounds, `reversed` for dark/colored ones. */
  tone?: 'brand' | 'reversed';
  /** Render only the confirmation dot (no wordmark) — for compact/icon-only spots. */
  mark?: boolean;
  /** Controls the wordmark's font size in px (or the dot's diameter when `mark` is set). */
  size?: number;
  className?: string;
}

const TONE = {
  brand: { text: '#0B1220', dot: '#023EBA' },
  reversed: { text: '#FFFFFF', dot: '#4E8BFF' },
} as const;

const WORDMARK_FONT =
  "'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

export default function Logo({ tone = 'brand', mark = false, size = 28, className = '' }: LogoProps) {
  const colors = TONE[tone];

  if (mark) {
    return (
      <span
        role="img"
        aria-label="Velon"
        className={className}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          borderRadius: '9999px',
          background: colors.dot,
          flexShrink: 0,
        }}
      />
    );
  }

  const dotSize = size * 0.28;
  const dotOffset = size * 0.17;

  return (
    <span
      className={`inline-flex items-end ${className}`}
      style={{ gap: size * 0.16 }}
    >
      <span
        style={{
          fontFamily: WORDMARK_FONT,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: '-0.01em',
          color: colors.text,
        }}
      >
        velon
      </span>
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: dotSize,
          height: dotSize,
          borderRadius: '9999px',
          background: colors.dot,
          marginBottom: dotOffset,
          flexShrink: 0,
        }}
      />
    </span>
  );
}
