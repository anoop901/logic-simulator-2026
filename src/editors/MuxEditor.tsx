import type { MuxComponentOptions } from "../types/LogicComponent";
import { BitWidthSelect } from "./controls";

interface MuxEditorProps {
  options: MuxComponentOptions;
  onUpdate: (options: MuxComponentOptions) => void;
}

export default function MuxEditor({ options, onUpdate }: MuxEditorProps) {
  return (
    <>
      <BitWidthSelect
        label="Select Bits"
        value={options.selectBits}
        max={8}
        onChange={(v) => onUpdate({ ...options, selectBits: v })}
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
