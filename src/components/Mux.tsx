import type { MuxComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

interface MuxRendererProps {
  x: number;
  y: number;
  options: MuxComponentOptions;
}

const MUX_WIDTH = 50;
const BASE_HEIGHT = 50;
const INPUT_SPACING = 15;
const TRAPEZOID_INSET = 10;

// Shared coordinate calculations (center-origin)
function getMuxGeometry(selectBits: number) {
  const numInputs = Math.pow(2, selectBits);
  const height = Math.max(BASE_HEIGHT, numInputs * INPUT_SPACING + 20);
  const halfW = MUX_WIDTH / 2;
  const halfH = height / 2;

  // Calculate input Y positions relative to center
  const totalInputHeight = (numInputs - 1) * INPUT_SPACING;
  const inputYPositions: number[] = [];
  for (let i = 0; i < numInputs; i++) {
    inputYPositions.push(-totalInputHeight / 2 + i * INPUT_SPACING);
  }

  return {
    numInputs,
    height,
    halfW,
    halfH,
    inputYPositions,
    // Key positions
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
  };
}

export function MuxRenderer({ x, y, options }: MuxRendererProps) {
  const { selectBits } = options;
  const geo = getMuxGeometry(selectBits);

  // Trapezoid path in center-origin coordinates (wider on input side)
  const path = `M ${geo.leftX} ${geo.topY} L ${geo.rightX} ${
    geo.topY + TRAPEZOID_INSET
  } L ${geo.rightX} ${geo.bottomY - TRAPEZOID_INSET} L ${geo.leftX} ${
    geo.bottomY
  } Z`;

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
        x={0}
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
        x={0}
        y={0}
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

export default function terminalInfoOfMux(
  position: Position,
  options: MuxComponentOptions
): TerminalInfo[] {
  const { selectBits } = options;
  const geo = getMuxGeometry(selectBits);

  const result: TerminalInfo[] = [];

  // Data inputs (left side)
  for (let i = 0; i < geo.numInputs; i++) {
    result.push({
      name: `in${i}`,
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.inputYPositions[i],
      },
    });
  }

  // Select input (bottom)
  result.push({
    name: "sel",
    direction: "in",
    position: {
      x: position.x,
      y: position.y + geo.bottomY - TRAPEZOID_INSET / 2,
    },
  });

  // Output (right side)
  result.push({
    name: "out",
    direction: "out",
    position: {
      x: position.x + geo.rightX,
      y: position.y,
    },
  });

  return result;
}
