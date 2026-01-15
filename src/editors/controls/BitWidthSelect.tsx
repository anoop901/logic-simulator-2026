import NumberInput from "./NumberInput";

interface BitWidthSelectProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export default function BitWidthSelect({
  value,
  onChange,
  min = 1,
  max = 64,
  label = "Bit Width",
}: BitWidthSelectProps) {
  return (
    <NumberInput
      label={label}
      value={value}
      min={min}
      max={max}
      onChange={onChange}
    />
  );
}
