import type { LogicComponent } from "../types/LogicComponent";
import type { Wire } from "../types/Wire";
import { simulateComponent, type ComponentState } from "./simulation";
import terminalInfoOfComponent from "../components/terminalInfoOfComponent";

/**
 * Result of circuit simulation - values at all terminals.
 */
export type CircuitSimulationResult = Map<string, Map<string, bigint>>;

export function initialSimulationResult(components: LogicComponent[]) {
  return new Map(
    components.map((component) => [
      component.id,
      new Map(
        terminalInfoOfComponent(component).map((terminal) => [
          terminal.name,
          0n,
        ])
      ),
    ])
  );
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
  prevResult: CircuitSimulationResult | null
): CircuitSimulationResult {
  const wiresByInputTerminal = new Map(
    wires.map((wire) => [
      `${wire.to.componentId}-${wire.to.terminalName}`,
      wire,
    ])
  );

  // Terminal values: componentId -> (terminalName -> value)
  const terminalValues: CircuitSimulationResult =
    prevResult ?? initialSimulationResult(components);

  // Deep copy the terminal values
  const newTerminalValues: CircuitSimulationResult = new Map(
    Array.from(terminalValues.entries()).map(([componentId, terminals]) => [
      componentId,
      new Map(terminals),
    ])
  );

  for (const component of components) {
    // Gather input values for this component from connected wires
    const componentTerminals = terminalInfoOfComponent(component);
    const inputs = new Map<string, bigint>();

    for (const terminal of componentTerminals) {
      if (terminal.direction === "in") {
        // Look up the wire connected to this input terminal
        const wireKey = `${component.id}-${terminal.name}`;
        const wire = wiresByInputTerminal.get(wireKey);
        if (wire) {
          // Get the value from the source terminal
          const sourceValue =
            terminalValues
              .get(wire.from.componentId)
              ?.get(wire.from.terminalName) ?? 0n;
          inputs.set(terminal.name, sourceValue);
        } else {
          // No wire connected, default to 0
          inputs.set(terminal.name, 0n);
        }
      }
    }

    // Store input terminal values
    for (const [terminalName, inputValue] of inputs) {
      newTerminalValues.get(component.id)?.set(terminalName, inputValue);
    }

    // Simulate the component to get output values
    const outputs = simulateComponent(component, inputs, state);

    // Update output terminal values if they changed
    for (const [terminalName, outputValue] of outputs) {
      const currentValue =
        terminalValues.get(component.id)?.get(terminalName) ?? 0n;
      if (outputValue !== currentValue) {
        newTerminalValues.get(component.id)?.set(terminalName, outputValue);
      }
    }
  }

  return newTerminalValues;
}
