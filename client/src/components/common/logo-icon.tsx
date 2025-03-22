import { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 2v8a2 2 0 0 1-2 2H2" />
      <path d="M14 2v8a2 2 0 0 0 2 2h6" />
      <path d="M3 14c.83.64 1.97 1 3 1 2.42 0 4.44-1.56 4.9-3.6" />
      <path d="M17 14c-.83.64-1.97 1-3 1-2.42 0-4.44-1.56-4.9-3.6" />
      <rect x="8" y="19" width="8" height="3" rx="1" />
      <path d="M12 19v-3" />
    </svg>
  );
}
