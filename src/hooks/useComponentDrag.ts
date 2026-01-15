import { useState, useCallback } from "react";
import type { LogicComponent } from "../types/LogicComponent";
import type Position from "../types/Position";


interface ComponentDragState {
  draggingId: string | null;
  dragOffset: Position;
}

interface UseComponentDragOptions {
  onPositionChange: (id: string, position: Position) => void;
  onSelect: (id: string) => void;
}

export default function useComponentDrag({
  onPositionChange,
  onSelect,
}: UseComponentDragOptions) {
  const [dragState, setDragState] = useState<ComponentDragState>({
    draggingId: null,
    dragOffset: { x: 0, y: 0 },
  });

  const startDrag = useCallback(
    (position: Position, component: LogicComponent) => {
      onSelect(component.id);
      setDragState({
        draggingId: component.id,
        dragOffset: {
          x: position.x - component.position.x,
          y: position.y - component.position.y,
        },
      });
    },
    [onSelect]
  );

  const updateDrag = useCallback(
    (position: Position) => {
      if (!dragState.draggingId) return;

      onPositionChange(dragState.draggingId, {
        x: position.x - dragState.dragOffset.x,
        y: position.y - dragState.dragOffset.y,
      });
    },
    [dragState.draggingId, dragState.dragOffset, onPositionChange]
  );

  const endDrag = useCallback(() => {
    setDragState({ draggingId: null, dragOffset: { x: 0, y: 0 } });
  }, []);

  return {
    draggingId: dragState.draggingId,
    startDrag,
    updateDrag,
    endDrag,
  };
}
