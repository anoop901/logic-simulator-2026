import type { LogicComponent } from "../types/LogicComponent";
import type { Wire } from "../types/Wire";
import { simulateComponent, type ComponentState } from "./simulation";
import terminalInfoOfComponent from "../components/terminalInfoOfComponent";
import equal from "fast-deep-equal/es6";

/**
 * Result of circuit simulation - values at all terminals.
 */
export type CircuitSimulationResult = Map<string, Map<string, bigint>>;

function valuesAtComponentInResult(
  component: LogicComponent,
  simulationResult: CircuitSimulationResult,
  direction?: "in" | "out",
): Map<string, bigint> {
  const inputsAndOutputs = simulationResult.get(component.id);
  if (inputsAndOutputs == null) {
    return new Map();
  }
  const result = new Map<string, bigint>();
  let terminalInfo = terminalInfoOfComponent(component);
  if (direction != null) {
    terminalInfo = terminalInfo.filter(
      (terminal) => terminal.direction === direction,
    );
  }
  for (const inputTerminal of terminalInfo) {
    result.set(
      inputTerminal.name,
      inputsAndOutputs.get(inputTerminal.name) ?? 0n,
    );
  }
  return result;
}

/**
 * Simulate the entire circuit.
 * Propagates values from outputs through wires to inputs until stable.
 * @param components All components in the circuit
 * @param wires All wires connecting components
 * @param state State for sequential components
 * @returns Map of componentId -> (terminalName -> value) for all terminals
 */
export function simulateCircuit(
  components: LogicComponent[],
  wires: Wire[],
  state: ComponentState,
  prevResult?: CircuitSimulationResult | undefined,
): CircuitSimulationResult {
  const result: CircuitSimulationResult = new Map(
    components.map((component) => {
      const prevComponentResult = prevResult?.get(component.id);
      return [
        component.id,
        new Map(
          terminalInfoOfComponent(component).map((terminal) => [
            terminal.name,
            prevComponentResult?.get(terminal.name) ?? 0n,
          ]),
        ),
      ];
    }),
  );

  const outputTerminalToWire = Map.groupBy(
    wires,
    (wire) => `${wire.from.componentId}-${wire.from.terminalName}`,
  );

  function updateInputTerminalsConnectedToComponentOutputs(
    component: LogicComponent,
  ) {
    const outputValues = valuesAtComponentInResult(component, result, "out");
    for (const [outputTerminalName, value] of outputValues) {
      const outWires =
        outputTerminalToWire.get(`${component.id}-${outputTerminalName}`) ?? [];
      for (const outWire of outWires) {
        const toComponentId = outWire.to.componentId;
        const toInputTerminalName = outWire.to.terminalName;
        result.get(toComponentId)?.set(toInputTerminalName, value);
      }
    }
  }

  for (const component of components) {
    updateInputTerminalsConnectedToComponentOutputs(component);
  }

  const MAX_ITERATIONS = 100;
  let stabilized = false;
  let iteration = 0;
  for (iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    // Shuffle components to randomize propagation order
    // This breaks synchronous oscillation in circuits like RS latches
    const shuffledComponents = [...components].sort(() => Math.random() - 0.5);
    let changed = false;
    for (const component of shuffledComponents) {
      const inputs = valuesAtComponentInResult(component, result, "in");
      const oldOutputs = valuesAtComponentInResult(component, result, "out");
      const newOutputs = simulateComponent(component, inputs, state);
      if (equal(oldOutputs, newOutputs)) {
        continue;
      }
      changed = true;
      // Set output terminal values in result
      for (const [outputTerminalName, value] of newOutputs) {
        result.get(component.id)?.set(outputTerminalName, value);
      }
      // Update the values at the input terminals they are connected to
      updateInputTerminalsConnectedToComponentOutputs(component);
    }
    if (!changed) {
      stabilized = true;
      break;
    }
  }

  // TODO(#31): if loop exceeded MAX_ITERATIONS, tell the user somehow
  if (!stabilized) {
    console.error(
      `Circuit failed to stabilize after ${MAX_ITERATIONS} iterations`,
    );
  }

  return result;
}
