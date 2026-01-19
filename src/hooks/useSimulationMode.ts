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
  const intervalRef = useRef<number | null>(null);

  // Use a ref to always have access to the latest onClockStep
  const onClockStepRef = useRef(onClockStep);
  onClockStepRef.current = onClockStep;

  const clearRunInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    setIsRunning(false);
    onStart();
  }, [onStart]);

  const stopSimulation = useCallback(() => {
    clearRunInterval();
    setIsSimulating(false);
    setIsRunning(false);
    onStop();
  }, [clearRunInterval, onStop]);

  const clockStep = useCallback(() => {
    if (isSimulating) {
      onClockStepRef.current();
    }
  }, [isSimulating]);

  const run = useCallback(() => {
    if (isSimulating && !isRunning) {
      setIsRunning(true);
      intervalRef.current = window.setInterval(() => {
        onClockStepRef.current(); // Always calls the latest version
      }, RUN_INTERVAL_MS);
    }
  }, [isSimulating, isRunning]);

  const pause = useCallback(() => {
    clearRunInterval();
    setIsRunning(false);
  }, [clearRunInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRunInterval();
    };
  }, [clearRunInterval]);

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
