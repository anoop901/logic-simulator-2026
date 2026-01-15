import andGateIcon from "./assets/and-gate-icon.svg";
import nandGateIcon from "./assets/nand-gate-icon.svg";
import orGateIcon from "./assets/or-gate-icon.svg";
import norGateIcon from "./assets/nor-gate-icon.svg";
import xorGateIcon from "./assets/xor-gate-icon.svg";
import xnorGateIcon from "./assets/xnor-gate-icon.svg";
import notGateIcon from "./assets/not-gate-icon.svg";
import muxIcon from "./assets/mux-icon.svg";
import decoderIcon from "./assets/decoder-icon.svg";
import adderIcon from "./assets/adder-icon.svg";
import registerIcon from "./assets/register-icon.svg";
import memoryIcon from "./assets/memory-icon.svg";

import type { ComponentOptions } from "./types/LogicComponent";

export interface ComponentMenuOption {
  name: string;
  category: string;
  icon?: string;
  kind: string;
  options: ComponentOptions;
}

const COMPONENT_MENU_OPTIONS: ComponentMenuOption[] = [
  // Gates
  {
    name: "AND Gate",
    category: "Gate",
    icon: andGateIcon,
    kind: "gate",
    options: { type: "AND", numberOfInputs: 2, bitWidth: 1 },
  },
  {
    name: "OR Gate",
    category: "Gate",
    icon: orGateIcon,
    kind: "gate",
    options: { type: "OR", numberOfInputs: 2, bitWidth: 1 },
  },
  {
    name: "NOT Gate",
    category: "Gate",
    icon: notGateIcon,
    kind: "not",
    options: { bitWidth: 1 },
  },
  {
    name: "NAND Gate",
    category: "Gate",
    icon: nandGateIcon,
    kind: "gate",
    options: { type: "NAND", numberOfInputs: 2, bitWidth: 1 },
  },
  {
    name: "NOR Gate",
    category: "Gate",
    icon: norGateIcon,
    kind: "gate",
    options: { type: "NOR", numberOfInputs: 2, bitWidth: 1 },
  },
  {
    name: "XOR Gate",
    category: "Gate",
    icon: xorGateIcon,
    kind: "gate",
    options: { type: "XOR", numberOfInputs: 2, bitWidth: 1 },
  },
  {
    name: "XNOR Gate",
    category: "Gate",
    icon: xnorGateIcon,
    kind: "gate",
    options: { type: "XNOR", numberOfInputs: 2, bitWidth: 1 },
  },

  // Combinational - Mux
  {
    name: "2-to-1 Mux",
    category: "Combinational",
    icon: muxIcon,
    kind: "mux",
    options: { selectBits: 1, bitWidth: 1 },
  },
  {
    name: "4-to-1 Mux",
    category: "Combinational",
    icon: muxIcon,
    kind: "mux",
    options: { selectBits: 2, bitWidth: 1 },
  },
  {
    name: "8-to-1 Mux",
    category: "Combinational",
    icon: muxIcon,
    kind: "mux",
    options: { selectBits: 3, bitWidth: 1 },
  },
  {
    name: "16-to-1 Mux",
    category: "Combinational",
    icon: muxIcon,
    kind: "mux",
    options: { selectBits: 4, bitWidth: 1 },
  },

  // Combinational - Decoder
  {
    name: "1-bit Decoder",
    category: "Combinational",
    icon: decoderIcon,
    kind: "decoder",
    options: { inputBits: 1 },
  },
  {
    name: "2-bit Decoder",
    category: "Combinational",
    icon: decoderIcon,
    kind: "decoder",
    options: { inputBits: 2 },
  },
  {
    name: "3-bit Decoder",
    category: "Combinational",
    icon: decoderIcon,
    kind: "decoder",
    options: { inputBits: 3 },
  },
  {
    name: "4-bit Decoder",
    category: "Combinational",
    icon: decoderIcon,
    kind: "decoder",
    options: { inputBits: 4 },
  },

  // Arithmetic - Adder
  {
    name: "Full Adder",
    category: "Arithmetic",
    icon: adderIcon,
    kind: "adder",
    options: { bitWidth: 1 },
  },
  {
    name: "8-bit Adder",
    category: "Arithmetic",
    icon: adderIcon,
    kind: "adder",
    options: { bitWidth: 8 },
  },
  {
    name: "32-bit Adder",
    category: "Arithmetic",
    icon: adderIcon,
    kind: "adder",
    options: { bitWidth: 32 },
  },

  // Register
  {
    name: "D Latch",
    category: "Register",
    icon: registerIcon,
    kind: "register",
    options: { bitWidth: 1 },
  },
  {
    name: "8-bit Register",
    category: "Register",
    icon: registerIcon,
    kind: "register",
    options: { bitWidth: 8 },
  },
  {
    name: "32-bit Register",
    category: "Register",
    icon: registerIcon,
    kind: "register",
    options: { bitWidth: 32 },
  },

  // Memory
  {
    name: "256 B ROM",
    category: "Memory",
    icon: memoryIcon,
    kind: "memory",
    options: { type: "ROM", addressSize: 8, wordSize: 1 },
  },
  {
    name: "256 B RAM",
    category: "Memory",
    icon: memoryIcon,
    kind: "memory",
    options: { type: "RAM", addressSize: 8, wordSize: 1 },
  },
  {
    name: "64 KiB ROM",
    category: "Memory",
    icon: memoryIcon,
    kind: "memory",
    options: { type: "ROM", addressSize: 16, wordSize: 4 },
  },
  {
    name: "64 KiB RAM",
    category: "Memory",
    icon: memoryIcon,
    kind: "memory",
    options: { type: "RAM", addressSize: 16, wordSize: 4 },
  },
];

export default COMPONENT_MENU_OPTIONS;
