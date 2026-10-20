"use client";

import { useMagic } from "./experience";
import { WizardingCanvas } from "./castle-canvas";

export function HomeCanvasBackground() {
  const { enabled, ready } = useMagic();

  return (
    <div className="home-canvas-layer" data-ready={ready ? "true" : "false"}>
      <WizardingCanvas
        mode="background"
        motionEnabled={enabled && ready}
        className="home-canvas"
      />
    </div>
  );
}
