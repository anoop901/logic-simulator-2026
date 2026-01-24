import { useState, useCallback, useRef, useEffect } from "react";

const RUN_INTERVAL_MS = 500; // Clock speed when running

export interface SimulationModeState {
  isSimulating: boolean;
  isRunning: boolean;
}

export interface SimulationModeActions {
  startSimulation: () => void;
  stopSimulation: () => void;
  clockStep: () => void;
  run: () => void;
  pause: () => void;
}

export type SimulationMode = SimulationModeState & SimulationModeActions;

interface UseSimulationModeOptions {
  onClockStep: () => void;
  onStart: () => void;
  onStop: () => void;
}

export default function useSimulationMode({
  onClockStep,
  onStart,
  onStop,
}: UseSimulationModeOptions): SimulationMode {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Store the latest onClockStep in a ref so the interval always calls the current version
  const onClockStepRef = useRef(onClockStep);
  onClockStepRef.current = onClockStep;

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    setIsRunning(false);
    onStart();
  }, [onStart]);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    setIsRunning(false);
    onStop();
  }, [onStop]);

  const clockStep = useCallback(() => {
    if (isSimulating) {
      onClockStep();
    }
  }, [isSimulating, onClockStep]);

  const run = useCallback(() => {
    if (isSimulating) {
      setIsRunning(true);
    }
  }, [isSimulating]);

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
    isSimulating,
    isRunning,
    startSimulation,
    stopSimulation,
    clockStep,
    run,
    pause,
  };
}
