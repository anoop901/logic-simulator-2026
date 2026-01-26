import { useState, useCallback, useEffect } from "react";
import type { LogicComponent } from "../types/LogicComponent";
import type { Wire } from "../types/Wire";
import {
  type CircuitSimulationResult,
  simulateCircuit,
} from "../simulation/simulateCircuit";
import useSimulationMode, { type SimulationMode } from "./useSimulationMode";
import useSimulationState from "./useSimulationState";

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

  // Initialize simulation result when simulation starts
  useEffect(() => {
    if (simulationMode.isSimulating) {
      setResult(() => simulateCircuit(components, wires, simulationState));
    }
  }, [simulationMode.isSimulating]);

  // Recalculate simulation result when circuit changes, or register/memory values change
  useEffect(() => {
    if (simulationMode.isSimulating) {
      setResult((prevResult) =>
        simulateCircuit(components, wires, simulationState, prevResult),
      );
    }
  }, [simulationState, components, wires]);

  return {
    ...simulationMode,
    result,
  };
}
