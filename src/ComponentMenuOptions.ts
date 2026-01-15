import andGateIcon from "./assets/and-gate-icon.svg";
import nandGateIcon from "./assets/nand-gate-icon.svg";
import orGateIcon from "./assets/or-gate-icon.svg";
import norGateIcon from "./assets/nor-gate-icon.svg";
import xorGateIcon from "./assets/xor-gate-icon.svg";
import xnorGateIcon from "./assets/xnor-gate-icon.svg";
import notGateIcon from "./assets/not-gate-icon.svg";
import mux2to1Icon from "./assets/2-to-1-mux-icon.svg";
import mux4to1Icon from "./assets/4-to-1-mux-icon.svg";
import mux8to1Icon from "./assets/8-to-1-mux-icon.svg";
import mux16to1Icon from "./assets/16-to-1-mux-icon.svg";

// import muxIcon from "./assets/mux-icon.svg";
import decoder1Icon from "./assets/1-bit-decoder-icon.svg";
import decoder2Icon from "./assets/2-bit-decoder-icon.svg";
import decoder3Icon from "./assets/3-bit-decoder-icon.svg";
import decoder4Icon from "./assets/4-bit-decoder-icon.svg";
import adder1Icon from "./assets/full-adder-icon.svg";
import adder8Icon from "./assets/8-bit-adder-icon.svg";
import adder32Icon from "./assets/32-bit-adder-icon.svg";

import register1Icon from "./assets/d-latch-icon.svg";
import register8Icon from "./assets/8-bit-register-icon.svg";
import register32Icon from "./assets/32-bit-register-icon.svg";
import memory256BRAMIcon from "./assets/256-b-ram-icon.svg";
import memory256BROMIcon from "./assets/256-b-rom-icon.svg";
import memory64KiBRAMIcon from "./assets/64-kib-ram-icon.svg";
import memory64KiBROMIcon from "./assets/64-kib-rom-icon.svg";

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
    kind: "mux",
    icon: mux2to1Icon,
    options: { selectBits: 1, bitWidth: 1 },
  },
  {
    name: "4-to-1 Mux",
    category: "Combinational",
    icon: mux4to1Icon,
    kind: "mux",
    options: { selectBits: 2, bitWidth: 1 },
  },
  {
    name: "8-to-1 Mux",
    category: "Combinational",
    icon: mux8to1Icon,
    kind: "mux",
    options: { selectBits: 3, bitWidth: 1 },
  },
  {
    name: "16-to-1 Mux",
    category: "Combinational",
    icon: mux16to1Icon,
    kind: "mux",
    options: { selectBits: 4, bitWidth: 1 },
  },

  // Combinational - Decoder
  {
    name: "1-bit Decoder",
    category: "Combinational",
    icon: decoder1Icon,
    kind: "decoder",
    options: { inputBits: 1 },
  },
  {
    name: "2-bit Decoder",
    category: "Combinational",
    icon: decoder2Icon,
    kind: "decoder",
    options: { inputBits: 2 },
  },
  {
    name: "3-bit Decoder",
    category: "Combinational",
    icon: decoder3Icon,
    kind: "decoder",
    options: { inputBits: 3 },
  },
  {
    name: "4-bit Decoder",
    category: "Combinational",
    icon: decoder4Icon,
    kind: "decoder",
    options: { inputBits: 4 },
  },

  // Arithmetic - Adder
  {
    name: "Full Adder",
    category: "Arithmetic",
    icon: adder1Icon,
    kind: "adder",
    options: { bitWidth: 1 },
  },
  {
    name: "8-bit Adder",
    category: "Arithmetic",
    icon: adder8Icon,
    kind: "adder",
    options: { bitWidth: 8 },
  },
  {
    name: "32-bit Adder",
    category: "Arithmetic",
    icon: adder32Icon,
    kind: "adder",
    options: { bitWidth: 32 },
  },

  // Register
  {
    name: "D Latch",
    category: "Register",
    icon: register1Icon,
    kind: "register",
    options: { bitWidth: 1 },
  },
  {
    name: "8-bit Register",
    category: "Register",
    icon: register8Icon,
    kind: "register",
    options: { bitWidth: 8 },
  },
  {
    name: "32-bit Register",
    category: "Register",
    icon: register32Icon,
    kind: "register",
    options: { bitWidth: 32 },
  },

  // Memory
  {
    name: "256 B ROM",
    category: "Memory",
    icon: memory256BROMIcon,
    kind: "memory",
    options: { type: "ROM", addressSize: 8, wordSize: 1 },
  },
  {
    name: "256 B RAM",
    category: "Memory",
    icon: memory256BRAMIcon,
    kind: "memory",
    options: { type: "RAM", addressSize: 8, wordSize: 1 },
  },
  {
    name: "64 KiB ROM",
    category: "Memory",
    icon: memory64KiBROMIcon,
    kind: "memory",
    options: { type: "ROM", addressSize: 16, wordSize: 4 },
  },
  {
    name: "64 KiB RAM",
    category: "Memory",
    icon: memory64KiBRAMIcon,
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

export function nameToIconName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
