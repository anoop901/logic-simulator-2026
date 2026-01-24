import type {
  ComponentOptions,
  SwitchComponentOptions,
} from "./types/LogicComponent";
import type { TerminalWithComponent } from "./hooks/useWireDrag";

import { useMemo, useCallback, useState, useEffect } from "react";
import PropertiesPanel from "./PropertiesPanel";
import renderComponent from "./components/renderComponent";
import terminalInfoOfComponent from "./components/terminalInfoOfComponent";

import useSelection from "./hooks/useSelection";
import useComponents from "./hooks/useComponents";
import useWires from "./hooks/useWires";
import useComponentDrag from "./hooks/useComponentDrag";
import useWireDrag from "./hooks/useWireDrag";
import type Position from "./types/Position";
import {
  type CircuitSimulationResult,
  initialSimulationResult,
  simulateCircuit,
} from "./simulation/simulateCircuit";
import { SIMULATION_VALUE_COLOR } from "./utils/simulationColors";
import useSimulationMode from "./hooks/useSimulationMode";
import useSimulationState from "./hooks/useSimulationState";
import SimulationToolbar from "./SimulationToolbar";

const MAX_CUBE_BEZIER_ANCHOR_DISTANCE = 50;
const SIMULATION_SPEED_PROPAGATION_MS = 50;

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

  // Simulation state management
  const {
    state: simulationState,
    initializeState,
    applyClockEdge,
    resetState,
  } = useSimulationState(components);

  // Compute simulation result
  const [simulationResult, setSimulationResult] =
    useState<CircuitSimulationResult>(new Map());

  // Clock step callback for simulation mode
  const handleClockStep = useCallback(() => {
    applyClockEdge(simulationResult);
  }, [applyClockEdge, simulationResult]);

  // Simulation mode
  const simulationMode = useSimulationMode({
    onClockStep: handleClockStep,
    onStart: initializeState,
    onStop: resetState,
  });

  const continuousSimulate = useCallback(() => {
    setSimulationResult((prevResult) =>
      simulateCircuit(components, wires, simulationState, prevResult),
    );
  }, [components, wires, simulationState]);

  useEffect(() => {
    if (simulationMode.isSimulating) {
      const interval = setInterval(
        continuousSimulate,
        SIMULATION_SPEED_PROPAGATION_MS,
      );
      return () => clearInterval(interval);
    }
  }, [simulationMode.isSimulating, continuousSimulate]);

  useEffect(() => {
    if (simulationMode.isSimulating) {
      setSimulationResult(initialSimulationResult(components));
    }
  }, [simulationMode.isSimulating]);

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
    e.dataTransfer.dropEffect = !simulationMode.isSimulating ? "copy" : "none";
  };

  const handleDrop = (e: React.DragEvent<SVGSVGElement>) => {
    if (simulationMode.isSimulating) return; // Disable during simulation
    e.preventDefault();

    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const { kind, options } = JSON.parse(data);
      // Convert value to BigInt for constant components (JSON parses as number)
      if (kind === "constant" && typeof options.value === "number") {
        options.value = BigInt(options.value);
      }
      const newId = addComponent(kind, getSvgMousePosition(e), options);
      select(newId);
    } catch {
      // Invalid data, ignore
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (simulationMode.isSimulating) return; // Disable wire creation during simulation
    if (tryStartWireDrag(getSvgMousePosition(e))) {
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const pos = getSvgMousePosition(e);
    updateDrag(pos);
    if (wireDrag) {
      updateWireDrag(pos);
    }
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
  const selectionColor = [0, 136, 246];

  return (
    <div className="grow relative bg-default overflow-hidden canvas-grid">
      {/* Simulation toolbar */}
      <SimulationToolbar {...simulationMode} />

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
        {/* Selection highlight filter */}
        <defs>
          <filter
            id="selection-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feColorMatrix
              type="matrix"
              values={[
                [0, 0, 0, 0, selectionColor[0] / 255].join(" "),
                [0, 0, 0, 0, selectionColor[1] / 255].join(" "),
                [0, 0, 0, 0, selectionColor[2] / 255].join(" "),
                [0, 0, 0, 1, 0].join(" "),
              ].join("  ")}
            />
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="5"
              floodColor={`rgb(${selectionColor[0]},${selectionColor[1]},${selectionColor[2]})`}
            />
          </filter>
        </defs>

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

        {components.map((component) => (
          <g
            key={component.id}
            style={{
              cursor: simulationMode.isSimulating
                ? "default"
                : draggingId === component.id
                  ? "grabbing"
                  : "grab",
              filter:
                selectedId === component.id ? "url(#selection-glow)" : "none",
            }}
            onMouseDown={(e) => {
              if (simulationMode.isSimulating) return; // Disable during simulation
              e.preventDefault();
              e.stopPropagation();
              startDrag(getSvgMousePosition(e), component);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {renderComponent(component, {
              onSwitchToggle:
                component.kind === "switch" && simulationMode.isSimulating
                  ? () => {
                      updateComponentOptions(component.id, {
                        ...component.options,
                        isOn: !(component.options as SwitchComponentOptions)
                          .isOn,
                      });
                    }
                  : undefined,
              ledInputValue:
                component.kind === "led" && simulationMode.isSimulating
                  ? simulationResult.get(component.id)?.get("in")
                  : undefined,
            })}
          </g>
        ))}

        {/* Render terminal circles and simulation values */}
        {allTerminals.map((terminal) => {
          const componentValues = simulationResult.get(terminal.componentId);
          const value = componentValues?.get(terminal.name);

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
              {/* Display simulation value for output terminals */}
              {simulationMode.isSimulating &&
                terminal.direction === "out" &&
                value !== undefined && (
                  <text
                    x={terminal.position.x + 8}
                    y={terminal.position.y + 4}
                    fill={SIMULATION_VALUE_COLOR}
                    fontSize="12"
                    fontFamily="monospace"
                    fontWeight="bold"
                    style={{ pointerEvents: "none" }}
                  >
                    {value.toString()}
                  </text>
                )}
            </g>
          );
        })}
      </svg>

      {/* Properties panel - hidden during simulation */}
      {selectedComponent && !simulationMode.isSimulating && (
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
