import { useState, useCallback } from "react";
import type { TerminalInfo } from "../components/terminalInfoOfComponent";
import type Position from "../types/Position";

// Terminal with component reference for hit detection
export interface TerminalWithComponent extends TerminalInfo {
  componentId: string;
}

// In-progress wire drag state
export interface WireDragState {
  fromComponentId: string;
  fromTerminalName: string;
  fromPosition: Position;
  currentPosition: Position;
}

interface UseWireDragOptions {
  allTerminals: TerminalWithComponent[];
  isTerminalConnected: (componentId: string, terminalName: string) => boolean;
  onWireCreated: (
    fromComponentId: string,
    fromTerminalName: string,
    toComponentId: string,
    toTerminalName: string
  ) => void;
}

// Find the nearest terminal to a point within a threshold distance
function findNearestTerminal(
  position: Position,
  terminals: TerminalWithComponent[],
  direction: "in" | "out",
  maxDistance: number = 15
): TerminalWithComponent | null {
  let nearest: TerminalWithComponent | null = null;
  let nearestDist = maxDistance;

  for (const terminal of terminals) {
    if (terminal.direction !== direction) continue;
    const dx = terminal.position.x - position.x;
    const dy = terminal.position.y - position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = terminal;
    }
  }

  return nearest;
}

export default function useWireDrag({
  allTerminals,
  isTerminalConnected,
  onWireCreated,
}: UseWireDragOptions) {
  const [wireDrag, setWireDrag] = useState<WireDragState | null>(null);

  const getTargetTerminal = useCallback(() => {
    if (wireDrag == null) return null;
    const targetTerminal = findNearestTerminal(
      wireDrag.currentPosition,
      allTerminals,
      "in"
    );
    if (targetTerminal == null) return null;
    if (isTerminalConnected(targetTerminal.componentId, targetTerminal.name)) {
      return null;
    }
    return targetTerminal;
  }, [wireDrag, allTerminals, isTerminalConnected]);

  const targetTerminal = getTargetTerminal();
  const wireDragSnappedPosition = targetTerminal?.position;

  const tryStartWireDrag = useCallback(
    (position: Position): boolean => {
      const nearestOutput = findNearestTerminal(position, allTerminals, "out");

      if (nearestOutput) {
        setWireDrag({
          fromComponentId: nearestOutput.componentId,
          fromTerminalName: nearestOutput.name,
          fromPosition: nearestOutput.position,
          currentPosition: nearestOutput.position,
        });
        return true;
      }
      return false;
    },
    [allTerminals]
  );

  const updateWireDrag = useCallback((position: Position) => {
    setWireDrag((prev) =>
      prev ? { ...prev, currentPosition: position } : null
    );
  }, []);

  const endWireDrag = useCallback(() => {
    if (!wireDrag) return;

    if (targetTerminal) {
      onWireCreated(
        wireDrag.fromComponentId,
        wireDrag.fromTerminalName,
        targetTerminal.componentId,
        targetTerminal.name
      );
    }

    setWireDrag(null);
  }, [wireDrag, onWireCreated, targetTerminal]);

  const cancelWireDrag = useCallback(() => {
    setWireDrag(null);
  }, []);

  return {
    wireDrag,
    wireDragSnappedPosition,
    tryStartWireDrag,
    updateWireDrag,
    endWireDrag,
    cancelWireDrag,
  };
}
