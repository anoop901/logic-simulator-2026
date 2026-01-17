import type { LogicComponent } from "../types/LogicComponent";
import type { Wire } from "../types/Wire";
import { simulateComponent, type ComponentState } from "./simulation";
import terminalInfoOfComponent from "../components/terminalInfoOfComponent";

/**
 * Result of circuit simulation - values at all terminals.
 */
export type CircuitSimulationResult = Map<string, Map<string, bigint>>;

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
  state: ComponentState
): CircuitSimulationResult {
  // Build component lookup
  const componentById = new Map<string, LogicComponent>();
  for (const component of components) {
    componentById.set(component.id, component);
  }

  // Build wire lookup: for each input terminal, which output drives it
  // Key: "componentId-terminalName" of input terminal
  // Value: { componentId, terminalName } of the output terminal
  const inputToOutputWire = new Map<
    string,
    { componentId: string; terminalName: string }
  >();
  for (const wire of wires) {
    const key = `${wire.to.componentId}-${wire.to.terminalName}`;
    inputToOutputWire.set(key, wire.from);
  }

  // Terminal values: componentId -> (terminalName -> value)
  const terminalValues: CircuitSimulationResult = new Map();

  // Initialize all terminals to 0
  for (const component of components) {
    const terminals = terminalInfoOfComponent(component);
    const componentTerminals = new Map<string, bigint>();
    for (const terminal of terminals) {
      componentTerminals.set(terminal.name, 0n);
    }
    terminalValues.set(component.id, componentTerminals);
  }

  // Iteratively propagate values until stable (or max iterations)
  const MAX_ITERATIONS = 100;
  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    let changed = false;

    for (const component of components) {
      // Gather input values from connected wires
      const inputs = new Map<string, bigint>();
      const terminals = terminalInfoOfComponent(component);

      for (const terminal of terminals) {
        if (terminal.direction === "in") {
          const key = `${component.id}-${terminal.name}`;
          const source = inputToOutputWire.get(key);
          if (source) {
            const sourceTerminals = terminalValues.get(source.componentId);
            const value = sourceTerminals?.get(source.terminalName) ?? 0n;
            inputs.set(terminal.name, value);
          } else {
            inputs.set(terminal.name, 0n);
          }
        }
      }

      // Simulate component
      const outputs = simulateComponent(component, inputs, state);

      // Update output terminal values
      const componentTerminals = terminalValues.get(component.id)!;
      for (const [terminalName, value] of outputs) {
        const oldValue = componentTerminals.get(terminalName);
        if (oldValue !== value) {
          componentTerminals.set(terminalName, value);
          changed = true;
        }
      }
    }

    // If nothing changed, circuit is stable
    if (!changed) {
      break;
    }
  }

  return terminalValues;
}
