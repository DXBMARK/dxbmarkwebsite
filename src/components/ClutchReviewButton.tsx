const CLUTCH_REVIEW_URL =
  "https://review.clutch.co/review?provider_id=797b4916-7da8-4e36-9d20-0ccb74bb45c9";

type ClutchReviewButtonProps = {
  className?: string;
};

export default function ClutchReviewButton({
  className = "",
}: ClutchReviewButtonProps) {
  return (
    <a
      href={CLUTCH_REVIEW_URL}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label="Review DXBMARK LLC on Clutch"
      className={className}
    >
      <span
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white p-[1px]"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/icons/clutch-c.svg"
          alt=""
          className="h-full w-full object-contain"
        />
      </span>

      <span>Clutch Reviews</span>

      <span className="font-medium text-brand-secondary">
        Rate Us
      </span>
    </a>
  );
}
