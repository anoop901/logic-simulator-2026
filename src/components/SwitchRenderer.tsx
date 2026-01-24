import type { SwitchComponentOptions } from "../types/LogicComponent";
import { getSwitchGeometry } from "./switch";

interface SwitchRendererProps {
  x: number;
  y: number;
  options: SwitchComponentOptions;
  onToggle?: () => void;
}

export default function SwitchRenderer({
  x,
  y,
  options,
  onToggle,
}: SwitchRendererProps) {
  const geo = getSwitchGeometry();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.();
  };

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x={geo.leftX}
        y={geo.topY}
        width={geo.width}
        height={geo.height}
        fill="transparent"
        stroke="white"
        strokeWidth="2"
      />
      {/* Handle space */}
      <rect
        x={geo.handleSpaceLeft}
        y={geo.handleSpaceTop}
        width={geo.handleSpaceWidth}
        height={geo.handleSpaceHeight}
        rx={geo.handleRadius}
        fill={options.isOn ? "#ffffff80" : "transparent"}
        stroke="white"
        strokeWidth="2"
        style={{ cursor: onToggle ? "pointer" : undefined }}
        onClick={handleClick}
      />
      {/* Handle */}
      <circle
        cx={options.isOn ? geo.handleOnX : geo.handleOffX}
        cy={geo.centerY}
        r={geo.handleRadius}
        fill="white"
        style={{ cursor: onToggle ? "pointer" : undefined }}
        onClick={handleClick}
      />
      {/* Value label */}
      <text
        x={geo.labelX}
        y={geo.centerY}
        fill="white"
        fontSize="12"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {options.isOn ? "1" : "0"}
      </text>
    </g>
  );
}
