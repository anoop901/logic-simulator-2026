import type { OutputComponentOptions } from "../types/LogicComponent";
import { SIMULATION_VALUE_COLOR } from "../utils/simulationColors";
import { formatValue } from "./constant";
import { getOutputGeometry } from "./output";

const OUTPUT_RADIUS = 4;

interface OutputRendererProps {
  x: number;
  y: number;
  options: OutputComponentOptions;
  inputValue?: bigint; // Value at the input terminal during simulation
}

export default function OutputRenderer({
  x,
  y,
  options,
  inputValue,
}: OutputRendererProps) {
  const geo = getOutputGeometry(options.bitWidth, options.displayFormat);
  const displayValue =
    inputValue != null
      ? formatValue(inputValue, options.bitWidth, options.displayFormat)
      : null;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Body */}
      <rect
        x={geo.leftX}
        y={geo.topY}
        width={geo.width}
        height={geo.height}
        rx={OUTPUT_RADIUS}
        ry={OUTPUT_RADIUS}
        fill="transparent"
        stroke="white"
        strokeWidth="2"
      />

      {/* Value label */}
      {displayValue && (
        <text
          x={geo.centerX}
          y={geo.centerY}
          fill={SIMULATION_VALUE_COLOR}
          fontSize="12"
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {displayValue}
        </text>
      )}
    </g>
  );
}
