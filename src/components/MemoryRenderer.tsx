import type { MemoryComponentOptions } from "../types/LogicComponent";
import { getMemoryGeometry } from "./memory";

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

  // Generate internal line positions
  const internalLineYPositions = Array.from(
    { length: geo.internalLineCount },
    (_, i) =>
      geo.topY +
      geo.internalLineOffsetStart +
      (i + 1) * geo.internalLineSpacing,
  );

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Memory body (rectangle) */}
      <rect
        x={geo.leftX}
        y={geo.topY}
        width={geo.width}
        height={geo.height}
        fill="transparent"
        stroke="white"
        strokeWidth="2"
      />

      {/* Internal lines to represent memory cells */}
      {internalLineYPositions.map((lineY, i) => (
        <line
          key={i}
          x1={geo.leftX + 20}
          y1={lineY}
          x2={geo.rightX - 20}
          y2={lineY}
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
        y={geo.centerY}
        fill="white"
        fontSize="8"
        textAnchor="end"
        alignmentBaseline="central"
      >
        O
      </text>

      {/* Type label with size */}
      <text
        x={geo.centerX}
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
