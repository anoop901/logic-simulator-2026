import type { RegisterComponentOptions } from "../types/LogicComponent";
import { getRegisterGeometry, REGISTER_HEIGHT } from "./register";

interface RegisterRendererProps {
  x: number;
  y: number;
  options: RegisterComponentOptions;
}

export default function RegisterRenderer({
  x,
  y,
  options,
}: RegisterRendererProps) {
  const geo = getRegisterGeometry(options.bitWidth);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Register body (rectangle) */}
      <rect
        x={geo.leftX}
        y={geo.topY}
        width={geo.width}
        height={REGISTER_HEIGHT}
        fill="transparent"
        stroke="white"
        strokeWidth="2"
      />

      {/* Clock input (bottom side with triangle) */}
      <polygon
        points={`${-5},${geo.bottomY} ${0},${geo.bottomY - 8} ${5},${
          geo.bottomY
        }`}
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      />

      {/* Data input label */}
      <text
        x={geo.leftX + 3}
        y={0}
        fill="white"
        fontSize="8"
        textAnchor="start"
        alignmentBaseline="central"
      >
        D
      </text>

      {/* Data output label */}
      <text
        x={geo.rightX - 3}
        y={0}
        fill="white"
        fontSize="8"
        textAnchor="end"
        alignmentBaseline="central"
      >
        Q
      </text>

      {/* Label */}
      {geo.multiBit && (
        <text
          x={0}
          y={0}
          fill="white"
          fontSize="10"
          textAnchor="middle"
          alignmentBaseline="central"
          fontWeight="bold"
        >
          {geo.bitWidth}b REG
        </text>
      )}
    </g>
  );
}
