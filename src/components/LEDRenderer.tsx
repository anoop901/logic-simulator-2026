import type { LEDComponentOptions } from "../types/LogicComponent";
import { getLEDGeometry } from "./led";

interface LEDRendererProps {
  x: number;
  y: number;
  options: LEDComponentOptions;
  inputValue?: bigint; // Value at the input terminal during simulation
}

export default function LEDRenderer({ x, y, inputValue }: LEDRendererProps) {
  const geo = getLEDGeometry();

  // LED is lit if input value is non-zero
  const isLit = inputValue !== undefined && inputValue !== 0n;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* LED circle */}
      <circle
        cx={geo.centerX}
        cy={geo.centerY}
        r={geo.radius}
        fill={isLit ? "#ffffff80" : "transparent"}
        stroke="white"
        strokeWidth="2"
      />
    </g>
  );
}
