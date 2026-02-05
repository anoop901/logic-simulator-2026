import type { SplitterMergerComponentOptions } from "../types/LogicComponent";
import { BitWidthSelect } from "./controls";

interface SplitterMergerEditorProps {
  options: SplitterMergerComponentOptions;
  onUpdate: (options: SplitterMergerComponentOptions) => void;
}

export default function SplitterMergerEditor({
  options,
  onUpdate,
}: SplitterMergerEditorProps) {
  return (
    <>
      <BitWidthSelect
        label="Input Bit Width"
        value={options.inputBitWidth}
        onChange={(v) => onUpdate({ ...options, inputBitWidth: v })}
      />
      <BitWidthSelect
        label="Output Bit Width"
        value={options.outputBitWidth}
        onChange={(v) => onUpdate({ ...options, outputBitWidth: v })}
      />
    </>
  );
}
