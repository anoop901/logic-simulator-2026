import type { DecoderComponentOptions } from "../types/LogicComponent";
import { getDecoderGeometry, TRAPEZOID_INSET } from "./decoder";

interface DecoderRendererProps {
  x: number;
  y: number;
  options: DecoderComponentOptions;
}

export default function DecoderRenderer({
  x,
  y,
  options,
}: DecoderRendererProps) {
  const { inputBits } = options;
  const geo = getDecoderGeometry(inputBits);

  // Trapezoid path in center-origin coordinates (wider on output side)
  const path = `M ${geo.leftX} ${geo.topY + TRAPEZOID_INSET} L ${geo.rightX} ${
    geo.topY
  } L ${geo.rightX} ${geo.bottomY} L ${geo.leftX} ${
    geo.bottomY - TRAPEZOID_INSET
  } Z`;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Decoder body */}
      <path d={path} fill="transparent" stroke="white" strokeWidth="2" />

      {/* Output labels */}
      {geo.outputYPositions.map((outputY, i) => (
        <text
          key={`output-${i}`}
          x={geo.rightX - 3}
          y={outputY}
          fill="white"
          fontSize="8"
          textAnchor="end"
          alignmentBaseline="central"
        >
          {i}
        </text>
      ))}

      {/* Label */}
      <text
        x={0}
        y={3}
        fill="white"
        fontSize="10"
        textAnchor="middle"
        fontWeight="bold"
      >
        DEC
      </text>
    </g>
  );
}
