import type { MuxComponentOptions } from "../types/LogicComponent";
import { getMuxGeometry, TRAPEZOID_INSET } from "./mux";

interface MuxRendererProps {
  x: number;
  y: number;
  options: MuxComponentOptions;
}

export default function MuxRenderer({ x, y, options }: MuxRendererProps) {
  const { selectBits } = options;
  const geo = getMuxGeometry(selectBits);

  // Trapezoid path in center-origin coordinates (wider on input side)
  const path =
    `M ${geo.leftX} ${geo.topY} ` +
    `L ${geo.rightX} ${geo.topY + TRAPEZOID_INSET} ` +
    `L ${geo.rightX} ${geo.bottomY - TRAPEZOID_INSET} ` +
    `L ${geo.leftX} ${geo.bottomY} ` +
    `Z`;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Mux body */}
      <path d={path} fill="transparent" stroke="white" strokeWidth="2" />

      {/* Data input labels */}
      {geo.inputYPositions.map((inputY, i) => (
        <text
          key={`input-${i}`}
          x={geo.leftX + 3}
          y={inputY}
          fill="white"
          fontSize="8"
          textAnchor="start"
          alignmentBaseline="central"
        >
          {i}
        </text>
      ))}

      {/* Select input label */}
      <text
        x={geo.centerX}
        y={geo.bottomY - TRAPEZOID_INSET / 2 - 5}
        fill="white"
        fontSize="8"
        textAnchor="middle"
        alignmentBaseline="baseline"
      >
        S
      </text>

      {/* Label */}
      <text
        x={geo.centerX}
        y={geo.centerY}
        fill="white"
        fontSize="10"
        textAnchor="middle"
        fontWeight="bold"
        alignmentBaseline="central"
      >
        MUX
      </text>
    </g>
  );
}
