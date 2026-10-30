"use client";

import { PhotoWizardingCanvas } from "./photo-castle-canvas";

export interface LoadingSceneProps {
  className?: string;
  progress?: number;
}

export function LoadingScene({
  className = "",
  progress = 0,
}: LoadingSceneProps) {
  const normalized = Math.min(100, Math.max(0, Math.round(progress)));
  const progressRatio = normalized / 100;
  const cloudOpacity = Math.max(0.12, 1 - progressRatio * 1.65);
  const treeOpacity = Math.min(1, Math.max(0, (progressRatio - 0.14) * 4.1)) * Math.min(1, Math.max(0, (0.82 - progressRatio) * 2.1));
  const runeOpacity = Math.min(1, Math.max(0, (progressRatio - 0.48) * 2.1));

  return (
    <div
      className={`loading-scene arrival-scene ${className}`.trim()}
      data-progress={normalized}
      style={{
        "--arrival-progress": progressRatio,
      } as React.CSSProperties}
      aria-hidden="true"
    >
      <PhotoWizardingCanvas
        mode="loading"
        progress={progressRatio}
        motionEnabled
        className="arrival-castle-canvas"
      />
      <div className="arrival-cloud-field" style={{ opacity: cloudOpacity }}>
        <span className="arrival-cloud arrival-cloud-one" />
        <span className="arrival-cloud arrival-cloud-two" />
        <span className="arrival-cloud arrival-cloud-three" />
      </div>
      <div className="arrival-tree-silhouette" style={{ opacity: treeOpacity }}>
        <span className="arrival-tree-trunk" />
        <span className="arrival-tree-branch arrival-tree-branch-one" />
        <span className="arrival-tree-branch arrival-tree-branch-two" />
        <span className="arrival-tree-crown" />
      </div>
      <span className="arrival-rune-ring" style={{ opacity: runeOpacity }} />
      <span className="arrival-caption">
        {normalized < 28
          ? "Beyond the clouds"
          : normalized < 58
            ? "The path appears"
            : normalized < 92
              ? "The castle remembers"
              : "The gates are open"}
      </span>
    </div>
  );
}
