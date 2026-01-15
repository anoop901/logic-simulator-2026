import type { AdderComponentOptions } from "../types/LogicComponent";
import { BitWidthSelect } from "./controls";

interface AdderEditorProps {
  options: AdderComponentOptions;
  onUpdate: (options: AdderComponentOptions) => void;
}

export default function AdderEditor({ options, onUpdate }: AdderEditorProps) {
  return (
    <BitWidthSelect
      value={options.bitWidth}
      onChange={(v) => onUpdate({ ...options, bitWidth: v })}
    />
  );
}
