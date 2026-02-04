import type {
  ComponentOptions,
  SwitchComponentOptions,
} from "./types/LogicComponent";
import type { TerminalWithComponent } from "./hooks/useWireDrag";

import { useMemo } from "react";
import PropertiesPanel from "./PropertiesPanel";
import renderComponent from "./components/renderComponent";
import terminalInfoOfComponent from "./components/terminalInfoOfComponent";

import useSelection from "./hooks/useSelection";
import useComponents from "./hooks/useComponents";
import useWires from "./hooks/useWires";
import useComponentDrag from "./hooks/useComponentDrag";
import useWireDrag from "./hooks/useWireDrag";
import type Position from "./types/Position";
import { SIMULATION_VALUE_COLOR } from "./utils/simulationColors";
import useSimulation from "./hooks/useSimulation";
import SimulationToolbar from "./SimulationToolbar";
import getComponentGeometry from "./components/getComponentGeometry";

const MAX_CUBE_BEZIER_ANCHOR_DISTANCE = 50;
const SELECTION_RECTANGLE_MARGIN = 10;

// Get mouse position relative to SVG element
function getSvgMousePosition(e: React.MouseEvent<SVGElement>): {
  x: number;
  y: number;
} {
  const svg = e.currentTarget.ownerSVGElement ?? e.currentTarget;
  const rect = svg.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

const wirePath = ({ x: x1, y: y1 }: Position, { x: x2, y: y2 }: Position) => {
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const anchorDistance = Math.min(
    distance / 3,
    MAX_CUBE_BEZIER_ANCHOR_DISTANCE,
  );
  return (
    `M ${x1} ${y1} ` +
    `C ${x1 + anchorDistance} ${y1}, ` +
    `${x2 - anchorDistance} ${y2}, ` +
    `${x2} ${y2}`
  );
};

export default function Canvas() {
  const { selectedId, select, deselect } = useSelection();

  const {
    components,
    addComponent,
    updateComponentPosition,
    updateComponentOptions,
    deleteComponent,
    getComponent,
  } = useComponents();

  const { wires, addWire, deleteWiresForComponent, isTerminalConnected } =
    useWires();

  const { draggingId, startDrag, updateDrag, endDrag } = useComponentDrag({
    onPositionChange: updateComponentPosition,
    onSelect: select,
  });

  // Compute all terminals for all components
  const allTerminals = useMemo<TerminalWithComponent[]>(() => {
    const result: TerminalWithComponent[] = [];
    for (const component of components) {
      const terminals = terminalInfoOfComponent(component);
      for (const terminal of terminals) {
        result.push({ ...terminal, componentId: component.id });
      }
    }
    return result;
  }, [components]);

  const {
    wireDrag,
    wireDragSnappedPosition,
    tryStartWireDrag,
    updateWireDrag,
    endWireDrag,
    cancelWireDrag,
  } = useWireDrag({
    allTerminals,
    isTerminalConnected,
    onWireCreated: addWire,
  });

  const simulation = useSimulation({ components, wires });

  // Helper to get terminal position by componentId and terminalName
  const getTerminalPosition = (
    componentId: string,
    terminalName: string,
  ): { x: number; y: number } | null => {
    const terminal = allTerminals.find(
      (t) => t.componentId === componentId && t.name === terminalName,
    );
    return terminal?.position ?? null;
  };

  const handleDragOver = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = !simulation.isSimulating ? "copy" : "none";
  };

  const handleDrop = (e: React.DragEvent<SVGSVGElement>) => {
    if (simulation.isSimulating) return; // Disable during simulation
    e.preventDefault();

    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const { kind, options } = JSON.parse(data);
      // Convert value to BigInt for constant/input components (JSON parses as number)
      if (
        (kind === "constant" || kind === "input") &&
        typeof options.value === "number"
      ) {
        options.value = BigInt(options.value);
      }
      const newId = addComponent(kind, getSvgMousePosition(e), options);
      select(newId);
    } catch {
      // Invalid data, ignore
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (simulation.isSimulating) return; // Disable wire creation during simulation
    if (tryStartWireDrag(getSvgMousePosition(e))) {
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const pos = getSvgMousePosition(e);
    updateDrag(pos);
    updateWireDrag(pos);
  };

  const handleMouseUp = () => {
    if (wireDrag) {
      endWireDrag();
    }
    endDrag();
  };

  const handleDeleteComponent = () => {
    if (selectedId) {
      deleteComponent(selectedId);
      deleteWiresForComponent(selectedId);
      deselect();
    }
  };

  const selectedComponent = selectedId ? getComponent(selectedId) : undefined;

  return (
    <div className="grow relative bg-default overflow-hidden canvas-grid">
      {/* Simulation toolbar */}
      <SimulationToolbar {...simulation} />

      <svg
        width="100%"
        height="100%"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          endDrag();
          cancelWireDrag();
        }}
        onClick={() => {
          deselect();
        }}
      >
        {/* Render completed wires */}
        {wires.map((wire) => {
          const fromPos = getTerminalPosition(
            wire.from.componentId,
            wire.from.terminalName,
          );
          const toPos = getTerminalPosition(
            wire.to.componentId,
            wire.to.terminalName,
          );
          if (!fromPos || !toPos) return null;

          return (
            <path
              key={wire.id}
              d={wirePath(fromPos, toPos)}
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          );
        })}

        {/* Render in-progress wire drag */}
        {wireDrag && (
          <path
            d={wirePath(
              wireDrag.fromPosition,
              wireDragSnappedPosition ?? wireDrag.currentPosition,
            )}
            stroke="white"
            strokeWidth="2"
            strokeDasharray="5,5"
            fill="none"
            className={wireDragSnappedPosition ? "animate-movingdash" : ""}
          />
        )}

        {components.map((component) => {
          const geo = getComponentGeometry(component);
          return (
            <g
              key={component.id}
              style={{
                cursor: simulation.isSimulating
                  ? "default"
                  : draggingId === component.id
                    ? "grabbing"
                    : "grab",
              }}
              onMouseDown={(e) => {
                if (simulation.isSimulating) return; // Disable during simulation
                e.stopPropagation();
                startDrag(getSvgMousePosition(e), component);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {component.id === selectedId && (
                <rect
                  x={
                    component.position.x +
                    geo.leftX -
                    SELECTION_RECTANGLE_MARGIN
                  }
                  y={
                    component.position.y + geo.topY - SELECTION_RECTANGLE_MARGIN
                  }
                  width={geo.width + 2 * SELECTION_RECTANGLE_MARGIN}
                  height={geo.height + 2 * SELECTION_RECTANGLE_MARGIN}
                  rx={3}
                  fill="#ffffff22"
                />
              )}
              {renderComponent(component, {
                onSwitchToggle:
                  component.kind === "switch"
                    ? () => {
                        updateComponentOptions(component.id, {
                          ...component.options,
                          isOn: !(component.options as SwitchComponentOptions)
                            .isOn,
                        });
                      }
                    : undefined,
                onInputValueChange:
                  component.kind === "input"
                    ? (newValue: bigint) => {
                        updateComponentOptions(component.id, {
                          ...component.options,
                          value: newValue,
                        });
                      }
                    : undefined,
                ledInputValue:
                  component.kind === "led" && simulation.isSimulating
                    ? simulation.result.get(component.id)?.get("in")
                    : undefined,
                outputInputValue:
                  component.kind === "output" && simulation.isSimulating
                    ? simulation.result.get(component.id)?.get("in")
                    : undefined,
              })}
            </g>
          );
        })}

        {/* Render terminal circles */}
        {allTerminals.map((terminal) => {
          return (
            <g key={`${terminal.componentId}-${terminal.name}`}>
              {!isTerminalConnected(terminal.componentId, terminal.name) && (
                <circle
                  cx={terminal.position.x}
                  cy={terminal.position.y}
                  r={3}
                  fill="white"
                />
              )}
              {/* Invisible larger circle for hit testing */}
              {(terminal.direction === "in"
                ? !!wireDrag &&
                  !isTerminalConnected(terminal.componentId, terminal.name)
                : !wireDrag) && (
                <circle
                  cx={terminal.position.x}
                  cy={terminal.position.y}
                  r={15}
                  fill="transparent"
                  style={{
                    cursor:
                      terminal.direction === "out" ? "crosshair" : "default",
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Properties panel - hidden during simulation */}
      {selectedComponent && !simulation.isSimulating && (
        <PropertiesPanel
          selectedComponent={selectedComponent}
          onUpdateOptions={(newOptions: ComponentOptions) => {
            updateComponentOptions(selectedId!, newOptions);
          }}
          onDeleteComponent={handleDeleteComponent}
        />
      )}
    </div>
  );
}
