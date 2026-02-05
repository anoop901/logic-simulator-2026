import { useState, useCallback, useEffect } from "react";
import type {
  LogicComponent,
  MemoryComponentOptions,
  RegisterComponentOptions,
} from "../types/LogicComponent";
import type { ComponentState } from "../simulation/simulation";
import { updateRegisterOnClockEdge } from "../components/register";
import { updateMemoryOnClockEdge } from "../components/memory";
import type { CircuitSimulationResult } from "../simulation/simulateCircuit";
import terminalInfoOfComponent from "../components/terminalInfoOfComponent";

/**
 * Hook to manage state for sequential components during simulation.
 */
export default function useSimulationState(components: LogicComponent[]) {
  const [state, setState] = useState<ComponentState>({
    registerStates: new Map(),
    memoryStates: new Map(),
  });

  /**
   * Initialize state for all sequential components.
   * Registers start at 0, memory allocated based on addressSize.
   */
  const initializeState = useCallback(() => {
    const registerStates = new Map<string, bigint>();
    const memoryStates = new Map<string, Uint8Array>();

    for (const component of components) {
      if (component.kind === "register") {
        registerStates.set(component.id, 0n);
      } else if (component.kind === "memory") {
        const options = component.options as MemoryComponentOptions;
        const size = options.wordSize * Math.pow(2, options.addressSize);
        memoryStates.set(component.id, new Uint8Array(size));
      }
    }

    setState({ registerStates, memoryStates });
  }, [components]);

  /**
   * Sync state with components when they change during simulation.
   * Adds state for new sequential components, removes state for deleted ones.
   */
  useEffect(() => {
    setState((prevState) => {
      const newRegisterStates = new Map<string, bigint>();
      const newMemoryStates = new Map<string, Uint8Array>();

      for (const component of components) {
        if (component.kind === "register") {
          newRegisterStates.set(
            component.id,
            prevState.registerStates.get(component.id) ?? 0n,
          );
        } else if (component.kind === "memory") {
          const prevMemoryState = prevState.memoryStates.get(component.id);
          if (prevMemoryState != null) {
            newMemoryStates.set(component.id, prevMemoryState);
          } else {
            const options = component.options as MemoryComponentOptions;
            const size = options.wordSize * Math.pow(2, options.addressSize);
            newMemoryStates.set(component.id, new Uint8Array(size));
          }
        }
      }

      return {
        registerStates: newRegisterStates,
        memoryStates: newMemoryStates,
      };
    });
  }, [components]);

  /**
   * Apply clock edge updates to all sequential elements.
   * @param terminalValues Current terminal values from simulation
   */
  const updateStateOnClockStep = useCallback(
    (terminalValues: CircuitSimulationResult) => {
      setState((prevState) => {
        const newRegisterStates = new Map(prevState.registerStates);
        const newMemoryStates = new Map(prevState.memoryStates);

        for (const component of components) {
          if (component.kind === "register") {
            const options = component.options as RegisterComponentOptions;
            const currentState =
              prevState.registerStates.get(component.id) ?? 0n;

            // Gather inputs from terminal values
            const inputs = new Map<string, bigint>();
            const terminals = terminalInfoOfComponent(component);
            const componentTerminals = terminalValues.get(component.id);

            for (const terminal of terminals) {
              if (terminal.direction === "in" && componentTerminals) {
                inputs.set(
                  terminal.name,
                  componentTerminals.get(terminal.name) ?? 0n,
                );
              }
            }

            // For register, we need to get the value from the wire connected to 'd'
            // But terminal values only has the component's own terminals
            // We need to look at what's driving the 'd' input - this is passed via terminalValues
            const newState = updateRegisterOnClockEdge(
              options,
              inputs,
              currentState,
            );
            newRegisterStates.set(component.id, newState);
          } else if (component.kind === "memory") {
            const options = component.options as MemoryComponentOptions;
            const currentState =
              prevState.memoryStates.get(component.id) ?? new Uint8Array(0);

            // Gather inputs
            const inputs = new Map<string, bigint>();
            const terminals = terminalInfoOfComponent(component);
            const componentTerminals = terminalValues.get(component.id);

            for (const terminal of terminals) {
              if (terminal.direction === "in" && componentTerminals) {
                inputs.set(
                  terminal.name,
                  componentTerminals.get(terminal.name) ?? 0n,
                );
              }
            }

            const newState = updateMemoryOnClockEdge(
              options,
              inputs,
              currentState,
            );
            newMemoryStates.set(component.id, newState);
          }
        }

        return {
          registerStates: newRegisterStates,
          memoryStates: newMemoryStates,
        };
      });
    },
    [components],
  );

  return {
    state,
    initializeState,
    updateStateOnClockStep,
  };
}
