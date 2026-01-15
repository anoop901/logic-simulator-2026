import { useState, useCallback } from "react";
import type { LogicComponent, ComponentOptions } from "../types/LogicComponent";

export default function useComponents() {
  const [components, setComponents] = useState<LogicComponent[]>([]);
  const [nextId, setNextId] = useState(1);

  const addComponent = useCallback(
    (
      kind: LogicComponent["kind"],
      position: { x: number; y: number },
      options: ComponentOptions
    ): string => {
      const id = String(nextId);
      const newComponent: LogicComponent = { id, kind, position, options };
      setComponents((prev) => [...prev, newComponent]);
      setNextId((prev) => prev + 1);
      return id;
    },
    [nextId]
  );

  const updateComponentPosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setComponents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, position } : c))
      );
    },
    []
  );

  const updateComponentOptions = useCallback(
    (id: string, options: ComponentOptions) => {
      setComponents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, options } : c))
      );
    },
    []
  );

  const deleteComponent = useCallback((id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getComponent = useCallback(
    (id: string): LogicComponent | undefined => {
      return components.find((c) => c.id === id);
    },
    [components]
  );

  return {
    components,
    addComponent,
    updateComponentPosition,
    updateComponentOptions,
    deleteComponent,
    getComponent,
  };
}
