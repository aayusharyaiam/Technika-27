"use client";

export interface LoadingSceneProps {
  className?: string;
  progress?: number;
}

export function LoadingScene({
  className = "",
  progress = 0,
}: LoadingSceneProps) {
  return (
    <div
      className={`loading-scene ${className}`.trim()}
      aria-hidden="true"
    ></div>
  );
}
