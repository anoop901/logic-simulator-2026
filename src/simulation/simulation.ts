import type { LogicComponent } from "../types/LogicComponent";
import { simulateConstant } from "../components/constant";
import { simulateGate } from "../components/gate";
import { simulateNot } from "../components/not";
import { simulateAdder } from "../components/adder";
import { simulateMux } from "../components/mux";
import { simulateDecoder } from "../components/decoder";
import { simulateRegister } from "../components/register";
import { simulateMemory } from "../components/memory";
import visitComponent from "../components/visitComponent";

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
  return visitComponent(component, {
    visitConstant: (options) => simulateConstant(options),
    visitGate: (options) => simulateGate(options, inputs),
    visitNot: (options) => simulateNot(options, inputs),
    visitAdder: (options) => simulateAdder(options, inputs),
    visitMux: (options) => simulateMux(options, inputs),
    visitDecoder: (options) => simulateDecoder(options, inputs),
    visitRegister: (options) => {
      const registerState = state.registerStates.get(component.id) ?? 0n;
      return simulateRegister(options, registerState);
    },
    visitMemory: (options) => {
      const memoryState =
        state.memoryStates.get(component.id) ?? new Uint8Array(0);
      return simulateMemory(options, inputs, memoryState);
    },
  });
}
