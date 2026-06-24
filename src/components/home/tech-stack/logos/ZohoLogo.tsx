type ZohoLogoProps = {
  className?: string;
};

export function ZohoLogo({ className }: ZohoLogoProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 112 36"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#E42527" height="28" rx="5" transform="rotate(-7 16 18)" width="28" x="2" y="4" />
      <rect fill="#006FBA" height="28" rx="5" transform="rotate(5 42 18)" width="28" x="28" y="4" />
      <rect fill="#168C45" height="28" rx="5" transform="rotate(-4 68 18)" width="28" x="54" y="4" />
      <rect fill="#F9B21D" height="28" rx="5" transform="rotate(6 94 18)" width="28" x="80" y="4" />
      <g
        fill="#FFFFFF"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="17"
        fontWeight="900"
        textAnchor="middle"
      >
        <text x="16" y="24">Z</text>
        <text x="42" y="24">O</text>
        <text x="68" y="24">H</text>
        <text x="94" y="24">O</text>
      </g>
    </svg>
  );
}
