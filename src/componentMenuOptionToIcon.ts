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

import constant0 from "./assets/constant-0-icon.svg";
import constant1 from "./assets/constant-1-icon.svg";
import constantByte from "./assets/byte-constant-icon.svg";

import switchIcon from "./assets/switch-icon.svg";

import type { ComponentMenuOption } from "./componentMenuOptions";

const COMPONENT_MENU_OPTION_NAME_TO_ICON: Map<string, string> = new Map([
  // Gates
  ["AND Gate", andGateIcon],
  ["OR Gate", orGateIcon],
  ["NOT Gate", notGateIcon],
  ["NAND Gate", nandGateIcon],
  ["NOR Gate", norGateIcon],
  ["XOR Gate", xorGateIcon],
  ["XNOR Gate", xnorGateIcon],
  ["2-to-1 Mux", mux2to1Icon],
  ["4-to-1 Mux", mux4to1Icon],
  ["8-to-1 Mux", mux8to1Icon],
  ["16-to-1 Mux", mux16to1Icon],
  ["1-bit Decoder", decoder1Icon],
  ["2-bit Decoder", decoder2Icon],
  ["3-bit Decoder", decoder3Icon],
  ["4-bit Decoder", decoder4Icon],
  ["Full Adder", adder1Icon],
  ["8-bit Adder", adder8Icon],
  ["32-bit Adder", adder32Icon],
  ["D Latch", register1Icon],
  ["8-bit Register", register8Icon],
  ["32-bit Register", register32Icon],
  ["256 B ROM", memory256BROMIcon],
  ["256 B RAM", memory256BRAMIcon],
  ["64 KiB ROM", memory64KiBROMIcon],
  ["64 KiB RAM", memory64KiBRAMIcon],
  ["Constant 0", constant0],
  ["Constant 1", constant1],
  ["Byte Constant", constantByte],
  ["Switch", switchIcon],
]);

export default function componentMenuOptionToIcon(
  componentMenuOption: ComponentMenuOption,
): string | null {
  return (
    COMPONENT_MENU_OPTION_NAME_TO_ICON.get(componentMenuOption.name) ?? null
  );
}
