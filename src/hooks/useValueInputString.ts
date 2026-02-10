import { useState, useEffect } from "react";
import type { DisplayFormat } from "../types/LogicComponent";
import { formatValue, parseValue } from "../utils/displayFormat";

interface UseValueInputStringOptions {
  value: bigint;
  bitWidth: number;
  displayFormat: DisplayFormat;
  onUpdate: (newValue: bigint) => void;
}

export default function useValueInputString({
  value,
  bitWidth,
  displayFormat,
  onUpdate,
}: UseValueInputStringOptions) {
  const formattedValue = formatValue(value, bitWidth, displayFormat);
  const [inputValue, setInputValue] = useState<string>(formattedValue);
  const [autoFormatInput, setAutoFormatInput] = useState<boolean>(true);

  // If value/format/width changes externally, update input IF we are allowing auto-format
  useEffect(() => {
    if (autoFormatInput) {
      setInputValue(formattedValue);
    }
  }, [autoFormatInput, formattedValue]);

  const handleChange = (newValue: string) => {
    // Allows user to type anything (even invalid intermediate states)
    setInputValue(newValue);

    // Only commit update if valid
    const parsed = parseValue(newValue, displayFormat, bitWidth);
    if (parsed != null) {
      onUpdate(parsed);
    }
  };

  const handleFocus = () => {
    setAutoFormatInput(false);
  };

  const handleBlur = () => {
    setAutoFormatInput(true);
    // On blur, revert to formatted valid value (from the last successful update)
    // This ensures if user leaves invalid state, it resets to truth
    setInputValue(formattedValue);
  };

  const isValid = parseValue(inputValue, displayFormat, bitWidth) != null;

  return {
    inputValue,
    isValid,
    handleChange,
    handleFocus,
    handleBlur,
  };
}
