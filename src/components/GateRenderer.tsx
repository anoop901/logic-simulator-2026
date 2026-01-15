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
  halfW: number,
  halfH: number,
  curveStartX: number
): string {
  const width = halfW * 2;

  switch (type) {
    case "AND":
    case "NAND":
      // Flat left, curved right
      return `M ${-halfW} ${-halfH} L ${curveStartX} ${-halfH} Q ${halfW} ${-halfH}, ${halfW} 0 Q ${halfW} ${halfH}, ${curveStartX} ${halfH} L ${-halfW} ${halfH} Z`;

    case "OR":
    case "NOR":
    case "XOR":
    case "XNOR":
      // Curved left, pointed right
      return `M ${-halfW} ${-halfH} Q ${
        width * OR_CURVATURE - halfW
      } 0, ${-halfW} ${halfH} Q ${width * 0.5 - halfW} ${halfH}, ${halfW} 0 Q ${
        width * 0.5 - halfW
      } ${-halfH}, ${-halfW} ${-halfH} Z`;

    default:
      return `M ${-halfW} ${-halfH} L ${halfW} ${-halfH} L ${halfW} ${halfH} L ${-halfW} ${halfH} Z`;
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
          d={`M ${geo.leftX - XOR_CURVE_OFFSET} ${geo.topY} Q ${
            GATE_WIDTH * OR_CURVATURE - geo.halfW - XOR_CURVE_OFFSET
          } 0, ${geo.leftX - XOR_CURVE_OFFSET} ${geo.bottomY}`}
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
      )}

      {/* Gate body */}
      <path
        d={getGatePath(type, geo.halfW, geo.halfH, geo.curveStartX)}
        fill="transparent"
        stroke="white"
        strokeWidth="2"
      />

      {/* Inversion bubble */}
      {hasInversionBubble(type) && (
        <circle
          cx={geo.rightX + BUBBLE_RADIUS}
          cy={0}
          r={BUBBLE_RADIUS}
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
      )}

      {/* Gate type label */}
      <text
        x={0}
        y={0}
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
