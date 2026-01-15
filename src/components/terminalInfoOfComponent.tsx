import type {
  AdderComponentOptions,
  DecoderComponentOptions,
  GateComponentOptions,
  LogicComponent,
  MemoryComponentOptions,
  MuxComponentOptions,
  NotComponentOptions,
  RegisterComponentOptions,
} from "../types/LogicComponent";
import type Position from "../types/Position";
import { terminalInfoOfAdder } from "./adder";
import { terminalInfoOfDecoder } from "./decoder";
import { terminalInfoOfGate } from "./gate";
import { terminalInfoOfMemory } from "./memory";
import { terminalInfoOfMux } from "./mux";
import { terminalInfoOfNot } from "./not";
import { terminalInfoOfRegister } from "./register";

export interface TerminalInfo {
  name: string;
  direction: "in" | "out";
  position: Position;
}

export default function terminalInfoOfComponent(
  component: LogicComponent
): TerminalInfo[] {
  const { kind, position, options } = component;

  switch (kind) {
    case "gate":
      return terminalInfoOfGate(position, options as GateComponentOptions);
    case "not":
      return terminalInfoOfNot(position, options as NotComponentOptions);
    case "mux":
      return terminalInfoOfMux(position, options as MuxComponentOptions);
    case "decoder":
      return terminalInfoOfDecoder(
        position,
        options as DecoderComponentOptions
      );
    case "adder":
      return terminalInfoOfAdder(position, options as AdderComponentOptions);
    case "register":
      return terminalInfoOfRegister(
        position,
        options as RegisterComponentOptions
      );
    case "memory":
      return terminalInfoOfMemory(position, options as MemoryComponentOptions);
    default:
      return [];
  }
}
