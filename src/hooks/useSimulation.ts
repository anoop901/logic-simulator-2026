import { useState, useCallback, useEffect } from "react";
import type { LogicComponent } from "../types/LogicComponent";
import type { Wire } from "../types/Wire";
import {
  type CircuitSimulationResult,
  initialSimulationResult,
  simulateCircuit,
} from "../simulation/simulateCircuit";
import useSimulationMode, { type SimulationMode } from "./useSimulationMode";
import useSimulationState from "./useSimulationState";

const SIMULATION_SPEED_PROPAGATION_MS = 50;

interface UseSimulationOptions {
  components: LogicComponent[];
  wires: Wire[];
}

export interface Simulation extends SimulationMode {
  result: CircuitSimulationResult;
}

export default function useSimulation({
  components,
  wires,
}: UseSimulationOptions): Simulation {
  // Simulation state management (registers, memory)
  const {
    state: simulationState,
    initializeState,
    applyClockEdge,
    resetState,
  } = useSimulationState(components);

  // Simulation result (terminal values)
  const [result, setResult] = useState<CircuitSimulationResult>(new Map());

  // Clock step callback for simulation mode
  const handleClockStep = useCallback(() => {
    applyClockEdge(result);
  }, [applyClockEdge, result]);

  // Simulation mode (start/stop, run/pause, step)
  const simulationMode = useSimulationMode({
    onClockStep: handleClockStep,
    onStart: initializeState,
    onStop: resetState,
  });

  // Initialize result when simulation starts
  useEffect(() => {
    if (simulationMode.isSimulating) {
      setResult(initialSimulationResult(components));
    }
  }, [simulationMode.isSimulating]);

  // Continuous simulation loop
  const continuousSimulate = useCallback(() => {
    setResult((prevResult) =>
      simulateCircuit(components, wires, simulationState, prevResult),
    );
  }, [components, wires, simulationState]);

  useEffect(() => {
    if (simulationMode.isSimulating) {
      const interval = setInterval(
        continuousSimulate,
        SIMULATION_SPEED_PROPAGATION_MS,
      );
      return () => clearInterval(interval);
    }
  }, [simulationMode.isSimulating, continuousSimulate]);

  return {
    ...simulationMode,
    result,
  };
}
