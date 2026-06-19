import { cn } from "@/lib/utils";

export function WaveDivider({
  fill = "currentColor",
  className,
  flip = false,
}: {
  fill?: string;
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={cn(
        "block w-full",
        flip && "rotate-180",
        className
      )}
      style={{ height: "60px" }}
    >
      <path
        d="M0,40 C240,80 480,0 720,40 C960,80 1200,20 1440,50 L1440,100 L0,100 Z"
        fill={fill}
        opacity="0.55"
      />
      <path
        d="M0,55 C200,90 460,15 720,55 C980,95 1240,30 1440,65 L1440,100 L0,100 Z"
        fill={fill}
      />
    </svg>
  );
}
