import type { MemoryComponentOptions } from "../types/LogicComponent";
import type { TerminalInfo } from "./terminalInfoOfComponent";
import type Position from "../types/Position";

interface MemoryRendererProps {
  x: number;
  y: number;
  options: MemoryComponentOptions;
}

const MEMORY_WIDTH = 80;
const MEMORY_HEIGHT = 70;

// Shared coordinate calculations (center-origin)
function getMemoryGeometry() {
  const halfW = MEMORY_WIDTH / 2;
  const halfH = MEMORY_HEIGHT / 2;

  // Input Y positions relative to center
  const addrY = -halfH + 20;
  const dataY = 0;
  const weY = halfH - 15;

  return {
    halfW,
    halfH,
    addrY,
    dataY,
    weY,
    // Key positions
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
  };
}

export function MemoryRenderer({ x, y, options }: MemoryRendererProps) {
  const { type, addressSize } = options;
  const geo = getMemoryGeometry();
  const byteSize = Math.pow(2, addressSize);

  // Format byte size for display
  const formatSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return `${bytes / (1024 * 1024)}MiB`;
    if (bytes >= 1024) return `${bytes / 1024}KiB`;
    return `${bytes}B`;
  };

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Memory body (rectangle) */}
      <rect
        x={geo.leftX}
        y={geo.topY}
        width={MEMORY_WIDTH}
        height={MEMORY_HEIGHT}
        fill="transparent"
        stroke="white"
        strokeWidth="2"
      />

      {/* Internal lines to represent memory cells */}
      {[1, 2, 3].map((i) => (
        <line
          key={i}
          x1={geo.leftX + 20}
          y1={geo.topY + 15 + i * 12}
          x2={geo.rightX - 20}
          y2={geo.topY + 15 + i * 12}
          stroke="white"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
      ))}

      {/* Address input label */}
      <text
        x={geo.leftX + 3}
        y={geo.addrY}
        fill="white"
        fontSize="8"
        textAnchor="start"
        alignmentBaseline="central"
      >
        A
      </text>

      {/* RAM-specific inputs */}
      {type === "RAM" && (
        <>
          <text
            x={geo.leftX + 3}
            y={geo.dataY}
            fill="white"
            fontSize="8"
            textAnchor="start"
            alignmentBaseline="central"
          >
            D
          </text>
          <text
            x={geo.leftX + 3}
            y={geo.weY}
            fill="white"
            fontSize="8"
            textAnchor="start"
            alignmentBaseline="central"
          >
            WE
          </text>
        </>
      )}

      {/* Data output label */}
      <text
        x={geo.rightX - 3}
        y={0}
        fill="white"
        fontSize="8"
        textAnchor="end"
        alignmentBaseline="central"
      >
        O
      </text>

      {/* Type label with size */}
      <text
        x={0}
        y={geo.topY + 12}
        fill="white"
        fontSize="10"
        textAnchor="middle"
        fontWeight="bold"
      >
        {formatSize(byteSize)} {type}
      </text>
    </g>
  );
}

export default function terminalInfoOfMemory(
  position: Position,
  options: MemoryComponentOptions
): TerminalInfo[] {
  const { type } = options;
  const geo = getMemoryGeometry();

  const result: TerminalInfo[] = [
    // Address input (top-left)
    {
      name: "addr",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.addrY,
      },
    },
  ];

  if (type === "RAM") {
    // Data input (left, center)
    result.push({
      name: "data",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.dataY,
      },
    });
    // Write enable (left, bottom)
    result.push({
      name: "we",
      direction: "in",
      position: {
        x: position.x + geo.leftX,
        y: position.y + geo.weY,
      },
    });
  }

  // Output (right, center)
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
