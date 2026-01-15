import type { GateType, GateComponentOptions } from "../types/LogicComponent";
import { SelectField, NumberInput, BitWidthSelect } from "./controls";

interface GateEditorProps {
  options: GateComponentOptions;
  onUpdate: (options: GateComponentOptions) => void;
}

const GATE_TYPE_OPTIONS = [
  { value: "AND", label: "AND" },
  { value: "OR", label: "OR" },
  { value: "NAND", label: "NAND" },
  { value: "NOR", label: "NOR" },
  { value: "XOR", label: "XOR" },
  { value: "XNOR", label: "XNOR" },
];

export default function GateEditor({ options, onUpdate }: GateEditorProps) {
  return (
    <>
      <SelectField
        label="Type"
        value={options.type}
        options={GATE_TYPE_OPTIONS}
        onChange={(v) => onUpdate({ ...options, type: v as GateType })}
      />
      <NumberInput
        label="Inputs"
        value={options.numberOfInputs}
        min={2}
        max={8}
        onChange={(v) => onUpdate({ ...options, numberOfInputs: v })}
      />
      <BitWidthSelect
        value={options.bitWidth}
        onChange={(value: number): void =>
          onUpdate({ ...options, bitWidth: value })
        }
      />
    </>
  );
}
