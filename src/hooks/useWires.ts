import { useState, useCallback, useMemo } from "react";
import type { Wire } from "../types/Wire";

export default function useWires() {
  const [wires, setWires] = useState<Wire[]>([]);
  const [nextWireId, setNextWireId] = useState(1);

  const addWire = useCallback(
    (
      fromComponentId: string,
      fromTerminalName: string,
      toComponentId: string,
      toTerminalName: string
    ): string => {
      const id = String(nextWireId);
      const newWire: Wire = {
        id,
        from: { componentId: fromComponentId, terminalName: fromTerminalName },
        to: { componentId: toComponentId, terminalName: toTerminalName },
      };
      setWires((prev) => [...prev, newWire]);
      setNextWireId((prev) => prev + 1);
      return id;
    },
    [nextWireId]
  );

  const deleteWire = useCallback((id: string) => {
    setWires((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const deleteWiresForComponent = useCallback((componentId: string) => {
    setWires((prev) =>
      prev.filter(
        (w) =>
          w.from.componentId !== componentId && w.to.componentId !== componentId
      )
    );
  }, []);

  // Set of connected terminal keys for quick lookup
  const connectedTerminals = useMemo<Set<string>>(() => {
    const connected = new Set<string>();
    for (const wire of wires) {
      connected.add(`${wire.from.componentId}-${wire.from.terminalName}`);
      connected.add(`${wire.to.componentId}-${wire.to.terminalName}`);
    }
    return connected;
  }, [wires]);

  const isTerminalConnected = useCallback(
    (componentId: string, terminalName: string): boolean => {
      return connectedTerminals.has(`${componentId}-${terminalName}`);
    },
    [connectedTerminals]
  );

  return {
    wires,
    addWire,
    deleteWire,
    deleteWiresForComponent,
    isTerminalConnected,
  };
}
