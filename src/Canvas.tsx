import type { ComponentOptions } from "./types/LogicComponent";
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

const MAX_CUBE_BEZIER_ANCHOR_DISTANCE = 50;

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
    MAX_CUBE_BEZIER_ANCHOR_DISTANCE
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

  // Helper to get terminal position by componentId and terminalName
  const getTerminalPosition = (
    componentId: string,
    terminalName: string
  ): { x: number; y: number } | null => {
    const terminal = allTerminals.find(
      (t) => t.componentId === componentId && t.name === terminalName
    );
    return terminal?.position ?? null;
  };

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
            wire.from.terminalName
          );
          const toPos = getTerminalPosition(
            wire.to.componentId,
            wire.to.terminalName
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
              wireDragSnappedPosition ?? wireDrag.currentPosition
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
              cursor: draggingId === component.id ? "grabbing" : "grab",
              filter:
                selectedId === component.id ? "url(#selection-glow)" : "none",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              startDrag(getSvgMousePosition(e), component);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {renderComponent(component)}
          </g>
        ))}

        {/* Render terminal circles */}
        {allTerminals.map((terminal) => (
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
        ))}
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
