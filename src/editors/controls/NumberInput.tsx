import { Label, NumberField } from "@heroui/react";

interface NumberInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export default function NumberInput({
  label,
  value,
  min = 0,
  max = 999,
  onChange,
}: NumberInputProps) {
  return (
    <NumberField
      defaultValue={1024}
      minValue={min}
      maxValue={max}
      value={value}
      onChange={(newValue) => {
        onChange(newValue);
      }}
    >
      <Label>{label}</Label>
      <NumberField.Group>
        <NumberField.DecrementButton />
        <NumberField.Input className="w-full" />
        <NumberField.IncrementButton />
      </NumberField.Group>
    </NumberField>
  );
}
