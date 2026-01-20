import type { NotComponentOptions } from "../types/LogicComponent";
import { BUBBLE_RADIUS } from "./gate";
import { getNotGeometry } from "./not";

interface NotRendererProps {
  x: number;
  y: number;
  options: NotComponentOptions;
}

export default function NotRenderer({ x, y }: NotRendererProps) {
  const geo = getNotGeometry();

  // Triangle path in center-origin coordinates
  const trianglePath = `M ${geo.triangleLeftX} ${geo.triangleTopY} L ${geo.triangleRightX} ${geo.centerY} L ${geo.triangleLeftX} ${geo.triangleBottomY} Z`;

  // Label position: 1/3 from left edge of triangle
  const labelX =
    geo.triangleLeftX + (geo.triangleRightX - geo.triangleLeftX) / 3;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Triangle body */}
      <path
        d={trianglePath}
        fill="transparent"
        stroke="white"
        strokeWidth="2"
      />

      {/* Inversion bubble */}
      <circle
        cx={geo.bubbleX}
        cy={geo.centerY}
        r={BUBBLE_RADIUS}
        fill="none"
        stroke="white"
        strokeWidth="2"
      />

      {/* Label */}
      <text
        x={labelX}
        y={geo.centerY}
        fill="white"
        fontSize="10"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
      >
        NOT
      </text>
    </g>
  );
}
