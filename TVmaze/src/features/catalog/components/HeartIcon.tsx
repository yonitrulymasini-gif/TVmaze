type HeartIconProps = {
  filled: boolean;
};

export function HeartIcon({ filled }: HeartIconProps) {
  return (
    <svg className="heart-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8.1 3.6 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.9 1.3-1.8 2.9-2.9 4.9-2.9 3.5 0 5.6 3.6 4.4 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
