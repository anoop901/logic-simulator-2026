import type { GateComponentOptions, GateType } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

interface GateRendererProps {
  x: number;
  y: number;
  options: GateComponentOptions;
}

const GATE_WIDTH = 60;
const INPUT_SPACING = 15;

const OR_CURVATURE = 0.3;
const XOR_CURVE_OFFSET = 8;
const BUBBLE_RADIUS = 5;
const CURVE_PROPORTION = 0.5;

// Check if gate type needs a bubble (inversion)
function hasInversionBubble(type: GateType): boolean {
  return type === "NAND" || type === "NOR" || type === "XNOR";
}

// Check if gate type needs XOR extra curve
function hasXorCurve(type: GateType): boolean {
  return type === "XOR" || type === "XNOR";
}

// Check if gate type has curved left edge
function hasCurvedLeftEdge(type: GateType): boolean {
  return type === "OR" || type === "NOR" || type === "XOR" || type === "XNOR";
}

// Compute x-coordinate on the OR gate's left bezier curve at a given y (in center-origin)
// For quadratic bezier: y(t) = -halfH + t * height, we need to solve for t
function getLeftCurveXOffset(inputY: number, halfH: number): number {
  // Convert center-origin y to t (0 to 1)
  const t = (inputY + halfH) / (2 * halfH);
  return 2 * (1 - t) * t * GATE_WIDTH * OR_CURVATURE;
}

// Shared coordinate calculations (center-origin)
function getGateGeometry(type: GateType, numberOfInputs: number) {
  const height = numberOfInputs * INPUT_SPACING + 16;
  const halfW = GATE_WIDTH / 2;
  const halfH = height / 2;

  // Calculate input Y positions relative to center
  const totalInputHeight = (numberOfInputs - 1) * INPUT_SPACING;
  const inputYPositions: number[] = [];
  for (let i = 0; i < numberOfInputs; i++) {
    inputYPositions.push(-totalInputHeight / 2 + i * INPUT_SPACING);
  }

  // Calculate input X positions (accounting for curved left edge)
  const inputXPositions: number[] = [];
  for (let i = 0; i < numberOfInputs; i++) {
    let xOffset = -halfW;
    if (hasCurvedLeftEdge(type)) {
      xOffset = -halfW + getLeftCurveXOffset(inputYPositions[i], halfH);
      if (hasXorCurve(type)) {
        xOffset -= XOR_CURVE_OFFSET;
      }
    }
    inputXPositions.push(xOffset);
  }

  const bubbleOffset = hasInversionBubble(type) ? BUBBLE_RADIUS * 2 : 0;

  const curveStartX = halfW - CURVE_PROPORTION * GATE_WIDTH;

  return {
    height,
    halfW,
    halfH,
    inputYPositions,
    inputXPositions,
    // Key positions
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
    curveStartX,
    outputX: halfW + bubbleOffset,
  };
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

export function GateRenderer({ x, y, options }: GateRendererProps) {
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

export default function terminalInfoOfGate(
  position: Position,
  options: GateComponentOptions
): TerminalInfo[] {
  const { type, numberOfInputs } = options;
  const geo = getGateGeometry(type, numberOfInputs);

  const result: TerminalInfo[] = [];

  // Input terminals
  for (let i = 0; i < numberOfInputs; i++) {
    result.push({
      name: `in${i}`,
      direction: "in",
      position: {
        x: position.x + geo.inputXPositions[i],
        y: position.y + geo.inputYPositions[i],
      },
    });
  }

  // Output terminal
  result.push({
    name: "out",
    direction: "out",
    position: {
      x: position.x + geo.outputX,
      y: position.y,
    },
  });

  return result;
}
