"use client";

import { WizardingCanvas } from "./castle-canvas";

export interface LoadingSceneProps {
  className?: string;
  progress?: number;
}

export function LoadingScene({ className = "", progress = 0 }: LoadingSceneProps) {
  return (
    <div className={`loading-scene ${className}`.trim()} aria-hidden="true">
      <WizardingCanvas
        mode="loading"
        progress={progress / 100}
        className="loading-canvas"
      />
    </div>
  );
}
