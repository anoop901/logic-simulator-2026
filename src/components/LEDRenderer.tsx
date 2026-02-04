import type { LEDComponentOptions } from "../types/LogicComponent";
import {
  SIMULATION_VALUE_COLOR,
  SIMULATION_VALUE_COLOR_DARK,
} from "../utils/simulationColors";
import { getLEDGeometry } from "./led";

interface LEDRendererProps {
  x: number;
  y: number;
  options: LEDComponentOptions;
  inputValue?: bigint; // Value at the input terminal during simulation
}

export default function LEDRenderer({ x, y, inputValue }: LEDRendererProps) {
  const geo = getLEDGeometry();

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* LED circle */}
      <circle
        cx={geo.centerX}
        cy={geo.centerY}
        r={geo.radius}
        fill={
          inputValue == null
            ? "transparent"
            : inputValue === 0n
              ? SIMULATION_VALUE_COLOR_DARK
              : SIMULATION_VALUE_COLOR
        }
        stroke="white"
        strokeWidth="2"
      />
    </g>
  );
}
