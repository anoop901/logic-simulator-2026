import type { LogicComponent } from "../types/LogicComponent";
import type Position from "../types/Position";
import { terminalInfoOfAdder } from "./adder";
import { terminalInfoOfConstant } from "./constant";
import { terminalInfoOfDecoder } from "./decoder";
import { terminalInfoOfGate } from "./gate";
import { terminalInfoOfLED } from "./led";
import { terminalInfoOfInput } from "./input";
import { terminalInfoOfMemory } from "./memory";
import { terminalInfoOfMux } from "./mux";
import { terminalInfoOfNot } from "./not";
import { terminalInfoOfRegister } from "./register";
import { terminalInfoOfSwitch } from "./switch";
import visitComponent from "./visitComponent";
import { terminalInfoOfOutput } from "./output";
import { terminalInfoOfSplitterMerger } from "./splitterMerger";

export interface TerminalInfo {
  name: string;
  direction: "in" | "out";
  position: Position;
}

export default function terminalInfoOfComponent(
  component: LogicComponent,
): TerminalInfo[] {
  const { position } = component;
  return visitComponent(component, {
    visitGate: (options) => terminalInfoOfGate(position, options),
    visitNot: (options) => terminalInfoOfNot(position, options),
    visitMux: (options) => terminalInfoOfMux(position, options),
    visitDecoder: (options) => terminalInfoOfDecoder(position, options),
    visitAdder: (options) => terminalInfoOfAdder(position, options),
    visitRegister: (options) => terminalInfoOfRegister(position, options),
    visitMemory: (options) => terminalInfoOfMemory(position, options),
    visitConstant: (options) => terminalInfoOfConstant(position, options),
    visitSwitch: () => terminalInfoOfSwitch(position),
    visitLED: () => terminalInfoOfLED(position),
    visitInput: (options) => terminalInfoOfInput(position, options),
    visitOutput: (options) => terminalInfoOfOutput(position, options),
    visitSplitterMerger: (options) =>
      terminalInfoOfSplitterMerger(position, options),
  });
}
