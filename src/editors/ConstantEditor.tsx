import type {
  ConstantComponentOptions,
  DisplayFormat,
} from "../types/LogicComponent";
import { Label, TextField, Input } from "@heroui/react";
import { SelectField, BitWidthSelect } from "./controls";
import useValueInputString from "../hooks/useValueInputString";

interface ConstantEditorProps {
  options: ConstantComponentOptions;
  onUpdate: (options: ConstantComponentOptions) => void;
}

export const DISPLAY_FORMAT_OPTIONS = [
  { value: "bin", label: "Binary" },
  { value: "dec", label: "Decimal" },
  { value: "hex", label: "Hexadecimal" },
];

export default function ConstantEditor({
  options,
  onUpdate,
}: ConstantEditorProps) {
  const { inputValue, isValid, handleChange, handleFocus, handleBlur } =
    useValueInputString({
      value: options.value,
      bitWidth: options.bitWidth,
      displayFormat: options.displayFormat,
      onUpdate: (newValue) => onUpdate({ ...options, value: newValue }),
    });

  const handleDisplayFormatChange = (value: string) => {
    const newFormat = value as DisplayFormat;
    onUpdate({ ...options, displayFormat: newFormat });
  };

  const handleBitWidthChange = (bitWidth: number) => {
    const mask = (1n << BigInt(bitWidth)) - 1n;
    const newValue = options.value & mask;
    onUpdate({ ...options, bitWidth, value: newValue });
  };

  return (
    <div className="flex flex-col gap-4">
      <SelectField
        label="Display Format"
        value={options.displayFormat}
        options={DISPLAY_FORMAT_OPTIONS}
        onChange={handleDisplayFormatChange}
      />
      <BitWidthSelect
        value={options.bitWidth}
        onChange={handleBitWidthChange}
      />
      <TextField
        isInvalid={!isValid}
        value={inputValue}
        onChange={handleChange}
        onFocusChange={(isFocused) => {
          if (isFocused) handleFocus();
          else handleBlur();
        }}
      >
        <Label>Value</Label>
        <Input className="font-mono" />
      </TextField>
    </div>
  );
}
