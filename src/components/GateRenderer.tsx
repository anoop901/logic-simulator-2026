import type { GateComponentOptions, GateType } from "../types/LogicComponent";
import {
  BUBBLE_RADIUS,
  GATE_WIDTH,
  getGateGeometry,
  hasInversionBubble,
  hasXorCurve,
  OR_CURVATURE,
  XOR_CURVE_OFFSET,
} from "./gate";

interface GateRendererProps {
  x: number;
  y: number;
  options: GateComponentOptions;
}

// Draw the gate body shape based on type (center-origin coordinates)
function getGatePath(
  type: GateType,
  geo: ReturnType<typeof getGateGeometry>,
): string {
  switch (type) {
    case "AND":
    case "NAND":
      // Flat left, curved right
      return (
        `M ${geo.bodyLeftX} ${geo.bodyTopY} ` +
        `L ${geo.curveStartX} ${geo.bodyTopY} ` +
        `Q ${geo.bodyRightX} ${geo.bodyTopY}, ` +
        `${geo.bodyRightX} ${geo.centerY} ` +
        `Q ${geo.bodyRightX} ${geo.bodyBottomY}, ` +
        `${geo.curveStartX} ${geo.bodyBottomY} ` +
        `L ${geo.bodyLeftX} ${geo.bodyBottomY} ` +
        `Z`
      );

    case "OR":
    case "NOR":
    case "XOR":
    case "XNOR":
      // Curved left, pointed right
      return (
        `M ${geo.bodyLeftX} ${geo.bodyTopY} ` +
        `Q ${geo.bodyLeftX + geo.bodyWidth * OR_CURVATURE} ${geo.centerY}, ` +
        `${geo.bodyLeftX} ${geo.bodyBottomY} ` +
        `Q ${geo.centerX} ${geo.bodyBottomY}, ` +
        `${geo.bodyRightX} ${geo.centerY} ` +
        `Q ${geo.centerX} ${geo.bodyTopY}, ` +
        `${geo.bodyLeftX} ${geo.bodyTopY} ` +
        `Z`
      );

    default:
      return `M ${geo.bodyLeftX} ${geo.bodyTopY} L ${geo.bodyRightX} ${geo.bodyTopY} L ${geo.bodyRightX} ${geo.bodyBottomY} L ${geo.bodyLeftX} ${geo.bodyBottomY} Z`;
  }
}

export default function GateRenderer({ x, y, options }: GateRendererProps) {
  const { type, numberOfInputs } = options;
  const geo = getGateGeometry(type, numberOfInputs);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* XOR extra curve */}
      {hasXorCurve(type) && (
        <path
          d={
            `M ${geo.bodyLeftX - XOR_CURVE_OFFSET} ${geo.bodyTopY} ` +
            `Q ${
              geo.bodyLeftX + GATE_WIDTH * OR_CURVATURE - XOR_CURVE_OFFSET
            } ${geo.centerY}, ` +
            `${geo.bodyLeftX - XOR_CURVE_OFFSET} ${geo.bodyBottomY}`
          }
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
      )}

      {/* Gate body */}
      <path
        d={getGatePath(type, geo)}
        fill="transparent"
        stroke="white"
        strokeWidth="2"
      />

      {/* Inversion bubble */}
      {hasInversionBubble(type) && (
        <circle
          cx={geo.bubbleCenterX}
          cy={geo.bubbleCenterY}
          r={BUBBLE_RADIUS}
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
      )}

      {/* Gate type label */}
      <text
        x={geo.centerX}
        y={geo.centerY}
        fill="white"
        fontSize="10"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
      >
        {type}
      </text>
    </g>
  );
}
