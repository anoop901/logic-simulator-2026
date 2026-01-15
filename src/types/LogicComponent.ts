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

export type ComponentOptions =
  | GateComponentOptions
  | NotComponentOptions
  | MuxComponentOptions
  | DecoderComponentOptions
  | AdderComponentOptions
  | RegisterComponentOptions
  | MemoryComponentOptions;

// The main LogicComponent type with shared fields
export interface LogicComponent {
  id: string;
  kind: string;
  position: ComponentPosition;
  options: ComponentOptions;
}
