import type { MemoryComponentOptions } from "../types/LogicComponent";
import { getMemoryGeometry, MEMORY_HEIGHT, MEMORY_WIDTH } from "./Memory";

interface MemoryRendererProps {
  x: number;
  y: number;
  options: MemoryComponentOptions;
}

export default function MemoryRenderer({ x, y, options }: MemoryRendererProps) {
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
