import type {
  MemoryType,
  MemoryComponentOptions,
} from "../types/LogicComponent";
import { BitWidthSelect, SelectField } from "./controls";

interface MemoryEditorProps {
  options: MemoryComponentOptions;
  onUpdate: (options: MemoryComponentOptions) => void;
}

const MEMORY_TYPE_OPTIONS = [
  { value: "ROM", label: "ROM" },
  { value: "RAM", label: "RAM" },
];

const WORD_SIZE_OPTIONS = [
  { value: 1, label: "1 byte" },
  { value: 2, label: "2 bytes" },
  { value: 4, label: "4 bytes" },
];

export default function MemoryEditor({ options, onUpdate }: MemoryEditorProps) {
  return (
    <>
      <SelectField
        label="Type"
        value={options.type}
        options={MEMORY_TYPE_OPTIONS}
        onChange={(v) => onUpdate({ ...options, type: v as MemoryType })}
      />

      <BitWidthSelect
        label="Address Bits"
        value={options.addressSize}
        max={20}
        onChange={(value: number): void =>
          onUpdate({ ...options, addressSize: value })
        }
      />

      <SelectField
        label="Word Size"
        value={options.wordSize}
        options={WORD_SIZE_OPTIONS}
        onChange={(v) => onUpdate({ ...options, wordSize: parseInt(v) })}
      />
    </>
  );
}
