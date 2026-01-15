import type { AdderComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

interface AdderRendererProps {
  x: number;
  y: number;
  options: AdderComponentOptions;
}

const ADDER_WIDTH = 40;
const ADDER_HEIGHT = 100;
const NOTCH_DEPTH = 10;
const TRAPEZOID_INSET = 20;

// Shared coordinate calculations (center-origin)
function getAdderGeometry() {
  const halfW = ADDER_WIDTH / 2;
  const halfH = ADDER_HEIGHT / 2;

  // Input A and B Y positions relative to center
  const inputAY = -halfH + (ADDER_HEIGHT - NOTCH_DEPTH * 2) / 4;
  const inputBY = halfH - (ADDER_HEIGHT - NOTCH_DEPTH * 2) / 4;

  return {
    halfW,
    halfH,
    inputAY,
    inputBY,
    // Key positions
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
  };
}

export function AdderRenderer({ x, y }: AdderRendererProps) {
  const geo = getAdderGeometry();

  // ALU-style path in center-origin coordinates
  const path = `
    M ${geo.leftX} ${geo.topY} 
    L ${geo.rightX} ${geo.topY + TRAPEZOID_INSET} 
    L ${geo.rightX} ${geo.bottomY - TRAPEZOID_INSET} 
    L ${geo.leftX} ${geo.bottomY} 
    L ${geo.leftX} ${NOTCH_DEPTH} 
    L ${geo.leftX + NOTCH_DEPTH} 0 
    L ${geo.leftX} ${-NOTCH_DEPTH} 
    Z
  `;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Adder body */}
      <path d={path} fill="transparent" stroke="white" strokeWidth="2" />

      {/* Input A label */}
      <text
        x={geo.leftX + 3}
        y={geo.inputAY}
        fill="white"
        fontSize="8"
        textAnchor="start"
        alignmentBaseline="central"
      >
        A
      </text>

      {/* Input B label */}
      <text
        x={geo.leftX + 3}
        y={geo.inputBY}
        fill="white"
        fontSize="8"
        textAnchor="start"
        alignmentBaseline="central"
      >
        B
      </text>

      {/* Carry in label */}
      <text
        x={0}
        y={geo.topY + TRAPEZOID_INSET / 2 + 3}
        fill="white"
        fontSize="8"
        textAnchor="middle"
        alignmentBaseline="hanging"
      >
        Cin
      </text>

      {/* Carry out label */}
      <text
        x={0}
        y={geo.bottomY - TRAPEZOID_INSET / 2 - 3}
        fill="white"
        fontSize="8"
        textAnchor="middle"
      >
        Cout
      </text>

      {/* Label */}
      <text
        x={NOTCH_DEPTH / 2}
        y={0}
        fill="white"
        fontSize="10"
        textAnchor="middle"
        alignmentBaseline="central"
        fontWeight="bold"
      >
        ADD
      </text>
    </g>
  );
}

export default function terminalInfoOfAdder(
  position: Position,
  _options: AdderComponentOptions
): TerminalInfo[] {
  const geo = getAdderGeometry();

  return [
    // Input A (top-left)
    {
      name: "a",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.inputAY,
      },
    },
    // Input B (bottom-left)
    {
      name: "b",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.inputBY,
      },
    },
    // Carry in (top)
    {
      name: "cin",
      direction: "in",
      position: {
        x: position.x,
        y: position.y + geo.topY + TRAPEZOID_INSET / 2,
      },
    },
    // Sum output (right)
    {
      name: "sum",
      direction: "out",
      position: {
        x: position.x + geo.rightX,
        y: position.y,
      },
    },
    // Carry out (bottom)
    {
      name: "cout",
      direction: "out",
      position: {
        x: position.x,
        y: position.y + geo.bottomY - TRAPEZOID_INSET / 2,
      },
    },
  ];
}
