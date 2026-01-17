import type { ComponentOptions } from "./types/LogicComponent";

export interface ComponentMenuOption {
  name: string;
  category: string;
  kind: string;
  options: ComponentOptions;
}

const COMPONENT_MENU_OPTIONS: ComponentMenuOption[] = [
  // Gates
  {
    name: "AND Gate",
    category: "Gate",
    kind: "gate",
    options: { type: "AND", numberOfInputs: 2, bitWidth: 1 },
  },
  {
    name: "OR Gate",
    category: "Gate",
    kind: "gate",
    options: { type: "OR", numberOfInputs: 2, bitWidth: 1 },
  },
  {
    name: "NOT Gate",
    category: "Gate",
    kind: "not",
    options: { bitWidth: 1 },
  },
  {
    name: "NAND Gate",
    category: "Gate",
    kind: "gate",
    options: { type: "NAND", numberOfInputs: 2, bitWidth: 1 },
  },
  {
    name: "NOR Gate",
    category: "Gate",
    kind: "gate",
    options: { type: "NOR", numberOfInputs: 2, bitWidth: 1 },
  },
  {
    name: "XOR Gate",
    category: "Gate",
    kind: "gate",
    options: { type: "XOR", numberOfInputs: 2, bitWidth: 1 },
  },
  {
    name: "XNOR Gate",
    category: "Gate",
    kind: "gate",
    options: { type: "XNOR", numberOfInputs: 2, bitWidth: 1 },
  },

  // Constants
  {
    name: "Constant 0",
    category: "Constant",
    kind: "constant",
    options: { bitWidth: 1, value: 0n, displayFormat: "bin" },
  },
  {
    name: "Constant 1",
    category: "Constant",
    kind: "constant",
    options: { bitWidth: 1, value: 1n, displayFormat: "bin" },
  },
  {
    name: "Byte Constant",
    category: "Constant",
    kind: "constant",
    options: { bitWidth: 8, value: 0n, displayFormat: "hex" },
  },

  // Combinational - Mux
  {
    name: "2-to-1 Mux",
    category: "Combinational",
    kind: "mux",
    options: { selectBits: 1, bitWidth: 1 },
  },
  {
    name: "4-to-1 Mux",
    category: "Combinational",
    kind: "mux",
    options: { selectBits: 2, bitWidth: 1 },
  },
  {
    name: "8-to-1 Mux",
    category: "Combinational",
    kind: "mux",
    options: { selectBits: 3, bitWidth: 1 },
  },
  {
    name: "16-to-1 Mux",
    category: "Combinational",
    kind: "mux",
    options: { selectBits: 4, bitWidth: 1 },
  },

  // Combinational - Decoder
  {
    name: "1-bit Decoder",
    category: "Combinational",
    kind: "decoder",
    options: { inputBits: 1 },
  },
  {
    name: "2-bit Decoder",
    category: "Combinational",
    kind: "decoder",
    options: { inputBits: 2 },
  },
  {
    name: "3-bit Decoder",
    category: "Combinational",
    kind: "decoder",
    options: { inputBits: 3 },
  },
  {
    name: "4-bit Decoder",
    category: "Combinational",
    kind: "decoder",
    options: { inputBits: 4 },
  },

  // Arithmetic - Adder
  {
    name: "Full Adder",
    category: "Arithmetic",
    kind: "adder",
    options: { bitWidth: 1 },
  },
  {
    name: "8-bit Adder",
    category: "Arithmetic",
    kind: "adder",
    options: { bitWidth: 8 },
  },
  {
    name: "32-bit Adder",
    category: "Arithmetic",
    kind: "adder",
    options: { bitWidth: 32 },
  },

  // Register
  {
    name: "D Latch",
    category: "Register",
    kind: "register",
    options: { bitWidth: 1 },
  },
  {
    name: "8-bit Register",
    category: "Register",
    kind: "register",
    options: { bitWidth: 8 },
  },
  {
    name: "32-bit Register",
    category: "Register",
    kind: "register",
    options: { bitWidth: 32 },
  },

  // Memory
  {
    name: "256 B ROM",
    category: "Memory",
    kind: "memory",
    options: { type: "ROM", addressSize: 8, wordSize: 1 },
  },
  {
    name: "256 B RAM",
    category: "Memory",
    kind: "memory",
    options: { type: "RAM", addressSize: 8, wordSize: 1 },
  },
  {
    name: "64 KiB ROM",
    category: "Memory",
    kind: "memory",
    options: { type: "ROM", addressSize: 16, wordSize: 4 },
  },
  {
    name: "64 KiB RAM",
    category: "Memory",
    kind: "memory",
    options: { type: "RAM", addressSize: 16, wordSize: 4 },
  },
];

export default COMPONENT_MENU_OPTIONS;

/**
 * Convert component name to icon filename.
 */
export function nameToIconFilename(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") + "-icon.svg"
  );
}
