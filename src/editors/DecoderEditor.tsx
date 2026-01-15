import type { DecoderComponentOptions } from "../types/LogicComponent";
import { BitWidthSelect } from "./controls";

interface DecoderEditorProps {
  options: DecoderComponentOptions;
  onUpdate: (options: DecoderComponentOptions) => void;
}

export default function DecoderEditor({
  options,
  onUpdate,
}: DecoderEditorProps) {
  return (
    <BitWidthSelect
      label="Input Bits"
      value={options.inputBits}
      max={8}
      onChange={(v) => onUpdate({ ...options, inputBits: v })}
    />
  );
}
