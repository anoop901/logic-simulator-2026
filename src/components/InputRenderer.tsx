import type { InputComponentOptions } from "../types/LogicComponent";
import { getInputGeometry } from "./input";
import useValueInputString from "../hooks/useValueInputString";

const INPUT_RADIUS = 4;
const INVALID_COLOR = "#ef4444";

interface InputRendererProps {
  x: number;
  y: number;
  options: InputComponentOptions;
  onValueChange: (newValue: bigint) => void;
}

export default function InputRenderer({
  x,
  y,
  options,
  onValueChange,
}: InputRendererProps) {
  const geo = getInputGeometry(options.bitWidth, options.displayFormat);

  const { inputValue, isValid, handleChange, handleFocus, handleBlur } =
    useValueInputString({
      value: options.value,
      bitWidth: options.bitWidth,
      displayFormat: options.displayFormat,
      onUpdate: onValueChange ?? (() => {}),
    });

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Body */}
      <rect
        x={geo.leftX}
        y={geo.topY}
        width={geo.width}
        height={geo.height}
        rx={INPUT_RADIUS}
        ry={INPUT_RADIUS}
        fill="transparent"
        stroke={isValid ? "white" : INVALID_COLOR}
        strokeWidth="2"
      />

      {/* Input Overlay */}
      <foreignObject
        x={geo.leftX + 2}
        y={geo.topY + 2}
        width={geo.width - 4}
        height={geo.height - 4}
        style={{ filter: "none" }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={
            "w-full text-center text-xs font-mono font-bold bg-transparent outline-none" +
            (!isValid ? " text-danger" : "")
          }
        />
      </foreignObject>
    </g>
  );
}
