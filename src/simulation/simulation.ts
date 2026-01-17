import type { LogicComponent } from "../types/LogicComponent";
import { simulateConstant } from "../components/constant";
import { simulateGate } from "../components/gate";
import { simulateNot } from "../components/not";
import { simulateAdder } from "../components/adder";
import { simulateMux } from "../components/mux";
import { simulateDecoder } from "../components/decoder";
import { simulateRegister } from "../components/register";
import { simulateMemory } from "../components/memory";

/**
 * State for sequential components (registers and memory).
 */
export interface ComponentState {
  registerStates: Map<string, bigint>;
  memoryStates: Map<string, Uint8Array>;
}

/**
 * Simulate a single component given its input values.
 * @param component The component to simulate
 * @param inputs Map of terminal name -> value for all input terminals
 * @param state State for sequential components
 * @returns Map of terminal name -> value for all output terminals
 */
export function simulateComponent(
  component: LogicComponent,
  inputs: Map<string, bigint>,
  state: ComponentState
): Map<string, bigint> {
  const { kind, options } = component;

  switch (kind) {
    case "constant":
      return simulateConstant(
        options as Parameters<typeof simulateConstant>[0]
      );

    case "gate":
      return simulateGate(
        options as Parameters<typeof simulateGate>[0],
        inputs
      );

    case "not":
      return simulateNot(options as Parameters<typeof simulateNot>[0], inputs);

    case "adder":
      return simulateAdder(
        options as Parameters<typeof simulateAdder>[0],
        inputs
      );

    case "mux":
      return simulateMux(options as Parameters<typeof simulateMux>[0], inputs);

    case "decoder":
      return simulateDecoder(
        options as Parameters<typeof simulateDecoder>[0],
        inputs
      );

    case "register": {
      const registerState = state.registerStates.get(component.id) ?? 0n;
      return simulateRegister(
        options as Parameters<typeof simulateRegister>[0],
        registerState
      );
    }

    case "memory": {
      const memoryState =
        state.memoryStates.get(component.id) ?? new Uint8Array(0);
      return simulateMemory(
        options as Parameters<typeof simulateMemory>[0],
        inputs,
        memoryState
      );
    }

    default:
      // Unknown component type, return empty outputs
      return new Map<string, bigint>();
  }
}
