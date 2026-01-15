import type { RegisterComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

interface RegisterRendererProps {
  x: number;
  y: number;
  options: RegisterComponentOptions;
}

const REGISTER_WIDTH_SINGLE_BIT = 50;
const REGISTER_WIDTH_MULTIBIT = 80;
const REGISTER_HEIGHT = 40;

// Shared coordinate calculations (center-origin)
function getRegisterGeometry(bitWidth: number) {
  const multiBit = bitWidth > 1;
  const width = multiBit ? REGISTER_WIDTH_MULTIBIT : REGISTER_WIDTH_SINGLE_BIT;
  const halfW = width / 2;
  const halfH = REGISTER_HEIGHT / 2;

  return {
    width,
    halfW,
    halfH,
    multiBit,
    bitWidth,
    // Key positions
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
  };
}

export function RegisterRenderer({ x, y, options }: RegisterRendererProps) {
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

export default function terminalInfoOfRegister(
  position: Position,
  options: RegisterComponentOptions
): TerminalInfo[] {
  const geo = getRegisterGeometry(options.bitWidth);

  return [
    // Data input (left)
    {
      name: "d",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y,
      },
    },
    // Data output (right)
    {
      name: "q",
      direction: "out",
      position: {
        x: position.x + geo.rightX,
        y: position.y,
      },
    },
  ];
}
