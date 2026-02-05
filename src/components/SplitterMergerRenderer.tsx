import type { SplitterMergerComponentOptions } from "../types/LogicComponent";
import { formatBitRange, getSplitterMergerGeometry } from "./splitterMerger";

interface SplitterMergerRendererProps {
  x: number;
  y: number;
  options: SplitterMergerComponentOptions;
}

/**
 * Format bit range label like [19:16] or [7] for single bit
 */
function formatBitLabel(startBit: number, endBit: number): string {
  return `[${formatBitRange(startBit, endBit)}]`;
}

export default function SplitterMergerRenderer({
  x,
  y,
  options,
}: SplitterMergerRendererProps) {
  const { inputBitWidth, outputBitWidth } = options;
  const geo = getSplitterMergerGeometry(inputBitWidth, outputBitWidth);

  // Determine which side has multiple terminals
  const labelsOnRight = geo.isSplitter; // Splitter: outputs on right; Merger: inputs on left

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Thin vertical bar */}
      <rect
        x={geo.leftX}
        y={geo.topY}
        width={geo.width}
        height={geo.height}
        fill="white"
        stroke="white"
        strokeWidth="1"
      />

      {/* Bit index labels */}
      {geo.chunks.map((chunk, i) => (
        <text
          key={i}
          x={labelsOnRight ? geo.rightX + 5 : geo.leftX - 5}
          y={geo.terminalYPositions[i]}
          fill="white"
          fontSize="8"
          textAnchor={labelsOnRight ? "start" : "end"}
          alignmentBaseline="middle"
        >
          {formatBitLabel(chunk.startBit, chunk.endBit)}
        </text>
      ))}
    </g>
  );
}
