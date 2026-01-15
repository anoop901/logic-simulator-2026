import type { RegisterComponentOptions } from "../types/LogicComponent";
import { BitWidthSelect } from "./controls";

interface RegisterEditorProps {
  options: RegisterComponentOptions;
  onUpdate: (options: RegisterComponentOptions) => void;
}

export default function RegisterEditor({
  options,
  onUpdate,
}: RegisterEditorProps) {
  return (
    <BitWidthSelect
      value={options.bitWidth}
      onChange={(v) => onUpdate({ ...options, bitWidth: v })}
    />
  );
}
