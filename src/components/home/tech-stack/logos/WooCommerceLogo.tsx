type WooCommerceLogoProps = {
  className?: string;
};

export function WooCommerceLogo({ className }: WooCommerceLogoProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 96 56"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 8h78c5 0 9 4 9 9v22c0 5-4 9-9 9H48l-13 8 3-8H9c-5 0-9-4-9-9V17c0-5 4-9 9-9Z"
        fill="#96588A"
      />
      <text
        fill="#FFFFFF"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="23"
        fontWeight="900"
        letterSpacing="-1.4"
        x="17"
        y="36"
      >
        Woo
      </text>
    </svg>
  );
}
