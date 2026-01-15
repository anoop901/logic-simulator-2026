import type { NotComponentOptions } from "../types/LogicComponent";
import { BitWidthSelect } from "./controls";

interface NotEditorProps {
  options: NotComponentOptions;
  onUpdate: (options: NotComponentOptions) => void;
}

export default function NotEditor({ options, onUpdate }: NotEditorProps) {
  return (
    <BitWidthSelect
      value={options.bitWidth}
      onChange={(value: number): void =>
        onUpdate({ ...options, bitWidth: value })
      }
    />
  );
}
