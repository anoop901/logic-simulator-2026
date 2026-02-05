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
import useSimulation from "./hooks/useSimulation";
import useWireRouting from "./hooks/useWireRouting";
import SimulationToolbar from "./SimulationToolbar";
import getComponentGeometry from "./components/getComponentGeometry";
import { DEBUGINFO_COLOR } from "./utils/constants";
import debugConfig from "./utils/debugConfig";
import type { RoutePoint } from "./routing";

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

/**
 * Generate SVG path string from orthogonal route points.
 */
function wirePathFromPoints(points: RoutePoint[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  return path;
}

/**
 * Generate a simple L-path for in-progress wire drag.
 * Goes horizontal first, then vertical.
 */
function dragWirePath(from: Position, to: Position): string {
  const midX = to.x;
  return `M ${from.x} ${from.y} L ${midX} ${from.y} L ${to.x} ${to.y}`;
}

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

  // Wire routing with orthogonal paths
  const { routes: wireRoutes } = useWireRouting({
    components,
    wires,
    allTerminals,
    isDragging: draggingId !== null,
  });

  const handleDragOver = (e: React.DragEvent<SVGSVGElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<SVGSVGElement>) => {
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
        {/* Render completed wires with orthogonal routing */}
        {wires.map((wire) => {
          const routePoints = wireRoutes.get(wire.id);
          if (!routePoints || routePoints.length < 2) return null;

          return (
            <path
              key={wire.id}
              d={wirePathFromPoints(routePoints)}
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          );
        })}

        {/* Render in-progress wire drag */}
        {wireDrag && (
          <path
            d={dragWirePath(
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
                cursor: draggingId === component.id ? "grabbing" : "grab",
              }}
              onMouseDown={(e) => {
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
                  component.kind === "led"
                    ? simulation.result.get(component.id)?.get("in")
                    : undefined,
                outputInputValue:
                  component.kind === "output"
                    ? simulation.result.get(component.id)?.get("in")
                    : undefined,
              })}
              {debugConfig.component_ids && (
                <text
                  x={component.position.x + geo.leftX}
                  y={component.position.y + geo.topY - 4}
                  fill={DEBUGINFO_COLOR}
                  fontSize={12}
                >
                  id: {component.id}
                </text>
              )}
              {debugConfig.register_values && component.kind === "register" && (
                <text
                  x={component.position.x}
                  y={component.position.y - 6}
                  fill={DEBUGINFO_COLOR}
                  fontSize={12}
                  textAnchor="middle"
                >
                  {simulation.state.registerStates.get(component.id)}
                </text>
              )}
            </g>
          );
        })}

        {/* Render terminal circles */}
        {allTerminals.map((terminal) => {
          const value = simulation.result
            .get(terminal.componentId)
            ?.get(terminal.name);
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
              {debugConfig.simulation_result && (
                <text
                  x={
                    terminal.position.x +
                    (terminal.direction === "out" ? 5 : -5)
                  }
                  y={terminal.position.y}
                  fontSize={12}
                  fill={DEBUGINFO_COLOR}
                  alignmentBaseline="middle"
                  textAnchor={terminal.direction === "out" ? "start" : "end"}
                >
                  {value}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Properties panel */}
      {selectedComponent && (
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
