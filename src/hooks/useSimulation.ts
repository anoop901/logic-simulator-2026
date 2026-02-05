import { useState, useCallback, useEffect } from "react";
import type { LogicComponent } from "../types/LogicComponent";
import type { Wire } from "../types/Wire";
import {
  type CircuitSimulationResult,
  simulateCircuit,
} from "../simulation/simulateCircuit";
import useSimulationMode, { type SimulationMode } from "./useSimulationMode";
import useSimulationState from "./useSimulationState";
import type { ComponentState } from "../simulation/simulation";

interface UseSimulationOptions {
  components: LogicComponent[];
  wires: Wire[];
}

export interface Simulation extends SimulationMode {
  result: CircuitSimulationResult;
  state: ComponentState;
}

export default function useSimulation({
  components,
  wires,
}: UseSimulationOptions): Simulation {
  // Simulation state management (registers, memory)
  const {
    state: simulationState,
    initializeState,
    updateStateOnClockStep,
  } = useSimulationState(components);

  // Simulation result (terminal values)
  const [result, setResult] = useState<CircuitSimulationResult>(new Map());

  // Clock step callback for simulation mode
  const handleClockStep = useCallback(() => {
    updateStateOnClockStep(result);
  }, [updateStateOnClockStep, result]);

  const simulationMode = useSimulationMode(handleClockStep);

  // Initialize simulation state and result on mount
  useEffect(() => {
    initializeState();
    setResult(() => simulateCircuit(components, wires, simulationState));
  }, []);

  // Recalculate simulation result when circuit changes, or register/memory values change
  useEffect(() => {
    setResult((prevResult) =>
      simulateCircuit(components, wires, simulationState, prevResult),
    );
  }, [simulationState, components, wires]);

  return {
    ...simulationMode,
    state: simulationState,
    result,
  };
}
