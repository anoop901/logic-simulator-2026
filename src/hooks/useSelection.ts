import { useState, useCallback } from "react";

export interface Selection {
  type: "component" | "wire";
  id: string;
}

export default function useSelection() {
  const [selection, setSelection] = useState<Selection | null>(null);

  const selectComponent = useCallback((componentId: string) => {
    setSelection({ type: "component", id: componentId });
  }, []);

  const selectWire = useCallback((wireId: string) => {
    setSelection({ type: "wire", id: wireId });
  }, []);

  const deselect = useCallback(() => {
    setSelection(null);
  }, []);

  return { selection, selectComponent, selectWire, deselect };
}
