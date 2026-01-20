import type { ConstantComponentOptions } from "../types/LogicComponent";
import { getConstantGeometry, formatValue } from "./constant";

const CONSTANT_RADIUS = 4;

interface ConstantRendererProps {
  x: number;
  y: number;
  options: ConstantComponentOptions;
}

export default function ConstantRenderer({
  x,
  y,
  options,
}: ConstantRendererProps) {
  const geo = getConstantGeometry(options.bitWidth, options.displayFormat);
  const displayValue = formatValue(
    options.value,
    options.bitWidth,
    options.displayFormat,
  );

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Rounded rectangle body */}
      <rect
        x={geo.leftX}
        y={geo.topY}
        width={geo.width}
        height={geo.height}
        rx={CONSTANT_RADIUS}
        ry={CONSTANT_RADIUS}
        fill="transparent"
        stroke="white"
        strokeWidth="2"
      />

      {/* Value label */}
      <text
        x={geo.centerX}
        y={geo.centerY}
        fill="white"
        fontSize="12"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {displayValue}
      </text>
    </g>
  );
}
