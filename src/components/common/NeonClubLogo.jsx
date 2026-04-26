export default function NeonClubLogo() {
  return (
    <div className="neon-logo-wrap mx-auto mb-8 w-full max-w-5xl px-4">
      <div className="neon-logo">
        <div className="neon-top">
          <span className="neon-club">Club</span>
          <span className="neon-gimnasia neon-gimnasia-flicker">Gimnasia</span>
        </div>

        <div className="neon-bottom">
          <div className="pin-group left-pins">
            <BowlingPin className="pin pin-green" />
            <BowlingPin className="pin pin-red" />
          </div>

          <div className="bowling-word-wrap">
            <span className="neon-bowling">BOWLING</span>
          </div>

          <div className="pin-group right-pins">
            <BowlingPin className="pin pin-blue" />
            <BowlingPin className="pin pin-red" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BowlingPin({ className = "" }) {
  return (
    <svg
      viewBox="0 0 64 120"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M32 5
           C22 5, 18 18, 22 30
           C25 40, 25 47, 18 65
           C10 85, 12 110, 32 115
           C52 110, 54 85, 46 65
           C39 47, 39 40, 42 30
           C46 18, 42 5, 32 5 Z"
        fill="currentColor"
      />
      <rect x="16" y="22" width="32" height="10" rx="5" fill="#ff2b2b" />
      <rect x="18" y="36" width="28" height="6" rx="3" fill="rgba(255,255,255,0.65)" />
    </svg>
  );
}