import type { LucideProps } from "lucide-react";

export const Logo = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
    <path d="M3 12h18"></path>
    <path d="M9 3v9"></path>
  </svg>
);
