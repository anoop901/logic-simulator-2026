import type { RegisterComponentOptions } from "../types/LogicComponent";
import { getRegisterGeometry } from "./register";

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
        height={geo.height}
        fill="transparent"
        stroke="white"
        strokeWidth="2"
      />

      {/* Clock input (bottom side with triangle) */}
      <polygon
        points={`${-geo.clockTriangleHalfWidth},${geo.bottomY} ${geo.centerX},${geo.bottomY - geo.clockTriangleHeight} ${geo.clockTriangleHalfWidth},${geo.bottomY}`}
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      />

      {/* Data input label */}
      <text
        x={geo.leftX + 3}
        y={geo.centerY}
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
        y={geo.centerY}
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
          x={geo.centerX}
          y={geo.centerY}
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
