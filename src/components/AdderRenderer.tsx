import type { AdderComponentOptions } from "../types/LogicComponent";
import { getAdderGeometry, NOTCH_DEPTH, TRAPEZOID_INSET } from "./adder";

interface AdderRendererProps {
  x: number;
  y: number;
  options: AdderComponentOptions;
}

export default function AdderRenderer({ x, y }: AdderRendererProps) {
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
