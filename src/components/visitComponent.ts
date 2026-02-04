import type {
  AdderComponentOptions,
  ConstantComponentOptions,
  DecoderComponentOptions,
  GateComponentOptions,
  LEDComponentOptions,
  LogicComponent,
  MemoryComponentOptions,
  MuxComponentOptions,
  NotComponentOptions,
  RegisterComponentOptions,
  SwitchComponentOptions,
  InputComponentOptions,
  OutputComponentOptions,
} from "../types/LogicComponent";

interface ComponentVisitor<T> {
  visitGate(options: GateComponentOptions): T;
  visitNot(options: NotComponentOptions): T;
  visitMux(options: MuxComponentOptions): T;
  visitDecoder(options: DecoderComponentOptions): T;
  visitAdder(options: AdderComponentOptions): T;
  visitRegister(options: RegisterComponentOptions): T;
  visitMemory(options: MemoryComponentOptions): T;
  visitConstant(options: ConstantComponentOptions): T;
  visitSwitch(options: SwitchComponentOptions): T;
  visitLED(options: LEDComponentOptions): T;
  visitInput(options: InputComponentOptions): T;
  visitOutput(options: OutputComponentOptions): T;
}

export default function visitComponent<T>(
  component: LogicComponent,
  visitor: ComponentVisitor<T>,
) {
  const { options } = component;
  switch (component.kind) {
    case "gate":
      return visitor.visitGate(options as GateComponentOptions);
    case "not":
      return visitor.visitNot(options as NotComponentOptions);
    case "mux":
      return visitor.visitMux(options as MuxComponentOptions);
    case "decoder":
      return visitor.visitDecoder(options as DecoderComponentOptions);
    case "adder":
      return visitor.visitAdder(options as AdderComponentOptions);
    case "register":
      return visitor.visitRegister(options as RegisterComponentOptions);
    case "memory":
      return visitor.visitMemory(options as MemoryComponentOptions);
    case "constant":
      return visitor.visitConstant(options as ConstantComponentOptions);
    case "switch":
      return visitor.visitSwitch(options as SwitchComponentOptions);
    case "led":
      return visitor.visitLED(options as LEDComponentOptions);
    case "input":
      return visitor.visitInput(options as InputComponentOptions);
    case "output":
      return visitor.visitOutput(options as OutputComponentOptions);
    default:
      throw new Error(`unknown component kind ${component.kind}`);
  }
}
