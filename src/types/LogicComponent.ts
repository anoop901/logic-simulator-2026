// Base position for all components on the canvas
export interface ComponentPosition {
  x: number;
  y: number;
}

// Gate types (NOT is separate)
export type GateType = "AND" | "OR" | "NAND" | "NOR" | "XOR" | "XNOR";

export interface GateComponentOptions {
  type: GateType;
  numberOfInputs: number;
  bitWidth: number;
}

// NOT gate (inverter) - single input, no numberOfInputs needed
export interface NotComponentOptions {
  bitWidth: number;
}

export interface MuxComponentOptions {
  selectBits: number; // 1 = 2-to-1, 2 = 4-to-1, etc.
  bitWidth: number;
}

export interface DecoderComponentOptions {
  inputBits: number; // 1-bit, 2-bit, etc.
}

export interface AdderComponentOptions {
  bitWidth: number;
}

export interface RegisterComponentOptions {
  bitWidth: number;
}

export type MemoryType = "ROM" | "RAM";

export interface MemoryComponentOptions {
  type: MemoryType;
  addressSize: number; // Address width in bits
  wordSize: number; // Word size in bytes
}

export interface SwitchComponentOptions {
  isOn: boolean;
}

// LED component - visual output indicator
export interface LEDComponentOptions {
  // LED has no configurable options - it just displays input value
}

// Display format for constant values
export type DisplayFormat = "bin" | "dec" | "hex";

export interface ConstantComponentOptions {
  bitWidth: number;
  value: bigint;
  displayFormat: DisplayFormat;
}

export interface InputComponentOptions {
  bitWidth: number;
  value: bigint;
  displayFormat: DisplayFormat;
}

export interface OutputComponentOptions {
  bitWidth: number;
  displayFormat: DisplayFormat;
}

export type ComponentOptions =
  | GateComponentOptions
  | NotComponentOptions
  | MuxComponentOptions
  | DecoderComponentOptions
  | AdderComponentOptions
  | RegisterComponentOptions
  | MemoryComponentOptions
  | ConstantComponentOptions
  | SwitchComponentOptions
  | LEDComponentOptions
  | InputComponentOptions
  | OutputComponentOptions;

// The main LogicComponent type with shared fields
export interface LogicComponent {
  id: string;
  kind: string;
  position: ComponentPosition;
  options: ComponentOptions;
}
