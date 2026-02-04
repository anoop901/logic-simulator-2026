import { DISPLAY_FORMAT_OPTIONS } from "./ConstantEditor";
import SelectField from "./controls/SelectField";
import BitWidthSelect from "./controls/BitWidthSelect";
import type {
  DisplayFormat,
  OutputComponentOptions,
} from "../types/LogicComponent";

interface OutputEditorProps {
  options: OutputComponentOptions;
  onUpdate: (options: OutputComponentOptions) => void;
}

export default function OutputEditor({ options, onUpdate }: OutputEditorProps) {
  return (
    <>
      <SelectField
        label="Display Format"
        value={options.displayFormat}
        options={DISPLAY_FORMAT_OPTIONS}
        onChange={(value: string) => {
          const newFormat = value as DisplayFormat;
          onUpdate({ ...options, displayFormat: newFormat });
        }}
      />
      <BitWidthSelect
        value={options.bitWidth}
        onChange={(bitWidth: number) => {
          onUpdate({ ...options, bitWidth });
        }}
      />
    </>
  );
}
