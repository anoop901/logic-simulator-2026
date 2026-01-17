import type {
  ConstantComponentOptions,
  DisplayFormat,
} from "../types/LogicComponent";
import { Label, TextField, Input } from "@heroui/react";
import { SelectField, BitWidthSelect } from "./controls";
import { useEffect, useState } from "react";

interface ConstantEditorProps {
  options: ConstantComponentOptions;
  onUpdate: (options: ConstantComponentOptions) => void;
}

const DISPLAY_FORMAT_OPTIONS = [
  { value: "bin", label: "Binary" },
  { value: "dec", label: "Decimal" },
  { value: "hex", label: "Hexadecimal" },
];

function parseValue(
  input: string,
  displayFormat: DisplayFormat,
  bitWidth: number
): bigint | null {
  try {
    let parsed: bigint;
    const trimmed = input.trim();

    if (trimmed === "") {
      return null;
    }

    switch (displayFormat) {
      case "bin":
        parsed = BigInt("0b" + trimmed);
        break;
      case "dec":
        parsed = BigInt(trimmed);
        break;
      case "hex": {
        const hexStr = trimmed.replace(/^0x/i, "");
        parsed = BigInt("0x" + hexStr);
        break;
      }
    }

    if (parsed < 0n) {
      return null;
    }

    const maxValue = (1n << BigInt(bitWidth)) - 1n;
    if (parsed > maxValue) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function formatValue(
  value: bigint,
  displayFormat: DisplayFormat,
  bitWidth: number
): string {
  const mask = (1n << BigInt(bitWidth)) - 1n;
  const maskedValue = value & mask;

  switch (displayFormat) {
    case "bin":
      return maskedValue.toString(2).padStart(bitWidth, "0");
    case "dec":
      return maskedValue.toString(10);
    case "hex": {
      const hexDigits = Math.ceil(bitWidth / 4);
      return (
        "0x" + maskedValue.toString(16).toUpperCase().padStart(hexDigits, "0")
      );
    }
  }
}

export default function ConstantEditor({
  options,
  onUpdate,
}: ConstantEditorProps) {
  const formattedOptionsValue = formatValue(
    options.value,
    options.displayFormat,
    options.bitWidth
  );
  const [inputValue, setInputValue] = useState<string>(formattedOptionsValue);
  const [autoFormatInput, setAutoFormatInput] = useState<boolean>(true);

  // if parent updates options, re-format value
  useEffect(() => {
    if (autoFormatInput) {
      setInputValue(formattedOptionsValue);
    }
  }, [autoFormatInput, formattedOptionsValue]);

  const handleChange = (newValue: string) => {
    // control the input, even if the value is invalid
    setInputValue(newValue);
    // update the parent if the value is valid
    const parsed = parseValue(
      newValue,
      options.displayFormat,
      options.bitWidth
    );
    if (parsed != null) {
      onUpdate({ ...options, value: parsed });
    }
  };

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
        isInvalid={
          parseValue(inputValue, options.displayFormat, options.bitWidth) ==
          null
        }
        value={inputValue}
        onChange={handleChange}
        onFocusChange={(isFocused) => {
          return setAutoFormatInput(!isFocused);
        }}
      >
        <Label>Value</Label>
        <Input className="font-mono" />
      </TextField>
    </div>
  );
}
