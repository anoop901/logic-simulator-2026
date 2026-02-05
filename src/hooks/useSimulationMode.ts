import { useState, useCallback, useRef, useEffect } from "react";

const RUN_INTERVAL_MS = 500; // Clock speed when running

export interface SimulationMode {
  isRunning: boolean;
  run: () => void;
  pause: () => void;
  onClockStep: () => void;
}

export default function useSimulationMode(
  onClockStep: () => void,
): SimulationMode {
  const [isRunning, setIsRunning] = useState(false);

  // Store the latest onClockStep in a ref so the interval always calls the current version
  const onClockStepRef = useRef(onClockStep);
  onClockStepRef.current = onClockStep;

  const run = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      const interval = window.setInterval(() => {
        onClockStepRef.current();
      }, RUN_INTERVAL_MS);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return {
    isRunning,
    run,
    pause,
    onClockStep,
  };
}
