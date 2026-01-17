import { describe, it, expect } from "vitest";
import { simulateConstant } from "../../components/constant";
import { simulateGate } from "../../components/gate";
import { simulateNot } from "../../components/not";
import { simulateAdder } from "../../components/adder";
import { simulateMux } from "../../components/mux";
import { simulateDecoder } from "../../components/decoder";
import {
  simulateRegister,
  updateRegisterOnClockEdge,
} from "../../components/register";
import {
  simulateMemory,
  updateMemoryOnClockEdge,
} from "../../components/memory";
import { simulateComponent, type ComponentState } from "../simulation";
import { simulateCircuit } from "../simulateCircuit";
import type { LogicComponent } from "../../types/LogicComponent";

describe("simulateConstant", () => {
  it("returns constant value masked to bitWidth", () => {
    const result = simulateConstant({
      bitWidth: 8,
      value: 0xffffn,
      displayFormat: "hex",
    });
    expect(result.get("out")).toBe(0xffn);
  });

  it("handles negative-looking values via masking", () => {
    const result = simulateConstant({
      bitWidth: 4,
      value: -1n,
      displayFormat: "bin",
    });
    expect(result.get("out")).toBe(0xfn);
  });
});

describe("simulateGate", () => {
  it("AND gate with all 1s", () => {
    const inputs = new Map([
      ["in0", 0xffn],
      ["in1", 0xffn],
    ]);
    const result = simulateGate(
      { type: "AND", numberOfInputs: 2, bitWidth: 8 },
      inputs
    );
    expect(result.get("out")).toBe(0xffn);
  });

  it("AND gate with mixed inputs", () => {
    const inputs = new Map([
      ["in0", 0x0fn],
      ["in1", 0xf0n],
    ]);
    const result = simulateGate(
      { type: "AND", numberOfInputs: 2, bitWidth: 8 },
      inputs
    );
    expect(result.get("out")).toBe(0x00n);
  });

  it("OR gate", () => {
    const inputs = new Map([
      ["in0", 0x0fn],
      ["in1", 0xf0n],
    ]);
    const result = simulateGate(
      { type: "OR", numberOfInputs: 2, bitWidth: 8 },
      inputs
    );
    expect(result.get("out")).toBe(0xffn);
  });

  it("NAND gate", () => {
    const inputs = new Map([
      ["in0", 0xffn],
      ["in1", 0xffn],
    ]);
    const result = simulateGate(
      { type: "NAND", numberOfInputs: 2, bitWidth: 8 },
      inputs
    );
    expect(result.get("out")).toBe(0x00n);
  });

  it("XOR gate", () => {
    const inputs = new Map([
      ["in0", 0x55n],
      ["in1", 0xffn],
    ]);
    const result = simulateGate(
      { type: "XOR", numberOfInputs: 2, bitWidth: 8 },
      inputs
    );
    expect(result.get("out")).toBe(0xaan);
  });

  it("3-input AND gate", () => {
    const inputs = new Map([
      ["in0", 0xffn],
      ["in1", 0xffn],
      ["in2", 0x0fn],
    ]);
    const result = simulateGate(
      { type: "AND", numberOfInputs: 3, bitWidth: 8 },
      inputs
    );
    expect(result.get("out")).toBe(0x0fn);
  });
});

describe("simulateNot", () => {
  it("inverts bits", () => {
    const inputs = new Map([["in", 0x55n]]);
    const result = simulateNot({ bitWidth: 8 }, inputs);
    expect(result.get("out")).toBe(0xaan);
  });

  it("masks to bitWidth", () => {
    const inputs = new Map([["in", 0x00n]]);
    const result = simulateNot({ bitWidth: 4 }, inputs);
    expect(result.get("out")).toBe(0x0fn);
  });
});

describe("simulateAdder", () => {
  it("adds two numbers", () => {
    const inputs = new Map([
      ["a", 5n],
      ["b", 3n],
      ["cin", 0n],
    ]);
    const result = simulateAdder({ bitWidth: 8 }, inputs);
    expect(result.get("sum")).toBe(8n);
    expect(result.get("cout")).toBe(0n);
  });

  it("handles carry in", () => {
    const inputs = new Map([
      ["a", 5n],
      ["b", 3n],
      ["cin", 1n],
    ]);
    const result = simulateAdder({ bitWidth: 8 }, inputs);
    expect(result.get("sum")).toBe(9n);
    expect(result.get("cout")).toBe(0n);
  });

  it("produces carry out on overflow", () => {
    const inputs = new Map([
      ["a", 255n],
      ["b", 1n],
      ["cin", 0n],
    ]);
    const result = simulateAdder({ bitWidth: 8 }, inputs);
    expect(result.get("sum")).toBe(0n);
    expect(result.get("cout")).toBe(1n);
  });
});

describe("simulateMux", () => {
  it("selects first input", () => {
    const inputs = new Map([
      ["in0", 10n],
      ["in1", 20n],
      ["sel", 0n],
    ]);
    const result = simulateMux({ selectBits: 1, bitWidth: 8 }, inputs);
    expect(result.get("out")).toBe(10n);
  });

  it("selects second input", () => {
    const inputs = new Map([
      ["in0", 10n],
      ["in1", 20n],
      ["sel", 1n],
    ]);
    const result = simulateMux({ selectBits: 1, bitWidth: 8 }, inputs);
    expect(result.get("out")).toBe(20n);
  });

  it("4-to-1 mux selects correctly", () => {
    const inputs = new Map([
      ["in0", 100n],
      ["in1", 200n],
      ["in2", 300n],
      ["in3", 400n],
      ["sel", 2n],
    ]);
    const result = simulateMux({ selectBits: 2, bitWidth: 16 }, inputs);
    expect(result.get("out")).toBe(300n);
  });
});

describe("simulateDecoder", () => {
  it("activates correct output", () => {
    const inputs = new Map([["in", 2n]]);
    const result = simulateDecoder({ inputBits: 2 }, inputs);
    expect(result.get("out0")).toBe(0n);
    expect(result.get("out1")).toBe(0n);
    expect(result.get("out2")).toBe(1n);
    expect(result.get("out3")).toBe(0n);
  });

  it("handles input 0", () => {
    const inputs = new Map([["in", 0n]]);
    const result = simulateDecoder({ inputBits: 2 }, inputs);
    expect(result.get("out0")).toBe(1n);
    expect(result.get("out1")).toBe(0n);
  });
});

describe("simulateRegister", () => {
  it("returns current state", () => {
    const result = simulateRegister({ bitWidth: 8 }, 42n);
    expect(result.get("q")).toBe(42n);
  });

  it("masks to bitWidth", () => {
    const result = simulateRegister({ bitWidth: 4 }, 0xffn);
    expect(result.get("q")).toBe(0xfn);
  });
});

describe("updateRegisterOnClockEdge", () => {
  it("captures input value", () => {
    const inputs = new Map([["d", 123n]]);
    const newState = updateRegisterOnClockEdge({ bitWidth: 8 }, inputs, 0n);
    expect(newState).toBe(123n);
  });
});

describe("simulateMemory", () => {
  it("reads value at address", () => {
    const state = new Uint8Array([0x12, 0x34, 0x56, 0x78]);
    const inputs = new Map([["addr", 1n]]);
    const result = simulateMemory(
      { type: "ROM", addressSize: 2, wordSize: 1 },
      inputs,
      state
    );
    expect(result.get("out")).toBe(0x34n);
  });

  it("reads multi-byte word", () => {
    const state = new Uint8Array([0x12, 0x34, 0x56, 0x78]);
    const inputs = new Map([["addr", 1n]]);
    const result = simulateMemory(
      { type: "ROM", addressSize: 1, wordSize: 2 },
      inputs,
      state
    );
    expect(result.get("out")).toBe(0x7856n);
  });
});

describe("updateMemoryOnClockEdge", () => {
  it("ROM does not write", () => {
    const state = new Uint8Array([0x00, 0x00]);
    const inputs = new Map([
      ["addr", 0n],
      ["data", 0xffn],
      ["we", 1n],
    ]);
    const newState = updateMemoryOnClockEdge(
      { type: "ROM", addressSize: 1, wordSize: 1 },
      inputs,
      state
    );
    expect(newState[0]).toBe(0x00);
  });

  it("RAM writes when we=1", () => {
    const state = new Uint8Array([0x00, 0x00]);
    const inputs = new Map([
      ["addr", 0n],
      ["data", 0xabn],
      ["we", 1n],
    ]);
    const newState = updateMemoryOnClockEdge(
      { type: "RAM", addressSize: 1, wordSize: 1 },
      inputs,
      state
    );
    expect(newState[0]).toBe(0xab);
  });

  it("RAM does not write when we=0", () => {
    const state = new Uint8Array([0x00, 0x00]);
    const inputs = new Map([
      ["addr", 0n],
      ["data", 0xabn],
      ["we", 0n],
    ]);
    const newState = updateMemoryOnClockEdge(
      { type: "RAM", addressSize: 1, wordSize: 1 },
      inputs,
      state
    );
    expect(newState[0]).toBe(0x00);
  });
});

describe("simulateComponent", () => {
  const emptyState: ComponentState = {
    registerStates: new Map(),
    memoryStates: new Map(),
  };

  it("dispatches to gate simulate", () => {
    const component: LogicComponent = {
      id: "gate1",
      kind: "gate",
      position: { x: 0, y: 0 },
      options: { type: "AND", numberOfInputs: 2, bitWidth: 8 },
    };
    const inputs = new Map([
      ["in0", 0xffn],
      ["in1", 0x0fn],
    ]);
    const result = simulateComponent(component, inputs, emptyState);
    expect(result.get("out")).toBe(0x0fn);
  });

  it("dispatches to constant simulate", () => {
    const component: LogicComponent = {
      id: "const1",
      kind: "constant",
      position: { x: 0, y: 0 },
      options: { bitWidth: 8, value: 42n, displayFormat: "dec" },
    };
    const result = simulateComponent(component, new Map(), emptyState);
    expect(result.get("out")).toBe(42n);
  });
});

describe("simulateCircuit", () => {
  it("propagates constant through inverter", () => {
    const components: LogicComponent[] = [
      {
        id: "const1",
        kind: "constant",
        position: { x: 0, y: 0 },
        options: { bitWidth: 8, value: 0x55n, displayFormat: "hex" },
      },
      {
        id: "not1",
        kind: "not",
        position: { x: 100, y: 0 },
        options: { bitWidth: 8 },
      },
    ];
    const wires = [
      {
        id: "w1",
        from: { componentId: "const1", terminalName: "out" },
        to: { componentId: "not1", terminalName: "in" },
      },
    ];
    const state: ComponentState = {
      registerStates: new Map(),
      memoryStates: new Map(),
    };

    const result = simulateCircuit(components, wires, state);

    expect(result.get("const1")?.get("out")).toBe(0x55n);
    expect(result.get("not1")?.get("out")).toBe(0xaan);
  });

  it("propagates through chain of gates", () => {
    const components: LogicComponent[] = [
      {
        id: "const1",
        kind: "constant",
        position: { x: 0, y: 0 },
        options: { bitWidth: 8, value: 0xffn, displayFormat: "hex" },
      },
      {
        id: "const2",
        kind: "constant",
        position: { x: 0, y: 50 },
        options: { bitWidth: 8, value: 0x0fn, displayFormat: "hex" },
      },
      {
        id: "and1",
        kind: "gate",
        position: { x: 100, y: 25 },
        options: { type: "AND", numberOfInputs: 2, bitWidth: 8 },
      },
    ];
    const wires = [
      {
        id: "w1",
        from: { componentId: "const1", terminalName: "out" },
        to: { componentId: "and1", terminalName: "in0" },
      },
      {
        id: "w2",
        from: { componentId: "const2", terminalName: "out" },
        to: { componentId: "and1", terminalName: "in1" },
      },
    ];
    const state: ComponentState = {
      registerStates: new Map(),
      memoryStates: new Map(),
    };

    const result = simulateCircuit(components, wires, state);

    expect(result.get("and1")?.get("out")).toBe(0x0fn);
  });
});
