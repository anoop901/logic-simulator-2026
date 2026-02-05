/**
 * React hook for managing wire routing with caching and incremental updates.
 */

import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import type { LogicComponent } from "../types/LogicComponent";
import type { Wire } from "../types/Wire";
import type { TerminalWithComponent } from "./useWireDrag";
import type { RoutePoint, WireRoute, RoutingContext } from "../routing";
import {
  buildObstacleList,
  findOrthogonalPath,
  createFallbackPath,
  ROUTING_CONSTANTS,
} from "../routing";

interface UseWireRoutingOptions {
  components: LogicComponent[];
  wires: Wire[];
  allTerminals: TerminalWithComponent[];
  /** Set to true during drag operations to enable debouncing */
  isDragging?: boolean;
}

interface UseWireRoutingResult {
  /** Map of wireId to computed route points */
  routes: Map<string, RoutePoint[]>;
  /** Force re-route a specific wire */
  rerouteWire: (wireId: string) => void;
  /** Force re-route all wires */
  rerouteAll: () => void;
}

/**
 * Hook that computes orthogonal wire routes with obstacle avoidance.
 */
export default function useWireRouting({
  components,
  wires,
  allTerminals,
  isDragging = false,
}: UseWireRoutingOptions): UseWireRoutingResult {
  // Cache for computed routes
  const routeCacheRef = useRef<Map<string, RoutePoint[]>>(new Map());

  // Track component positions for detecting changes
  const prevComponentsRef = useRef<string>("");

  // Force update trigger
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Debounce timer for drag operations
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build obstacles from components
  const obstacles = useMemo(() => buildObstacleList(components), [components]);

  // Create a lookup for terminal positions
  const terminalPositions = useMemo(() => {
    const map = new Map<string, RoutePoint>();
    for (const terminal of allTerminals) {
      const key = `${terminal.componentId}-${terminal.name}`;
      map.set(key, terminal.position);
    }
    return map;
  }, [allTerminals]);

  // Get terminal position by component ID and terminal name
  const getTerminalPosition = useCallback(
    (componentId: string, terminalName: string): RoutePoint | null => {
      return terminalPositions.get(`${componentId}-${terminalName}`) ?? null;
    },
    [terminalPositions],
  );

  // Route a single wire
  const routeWire = useCallback(
    (wire: Wire, existingRoutes: WireRoute[]): RoutePoint[] | null => {
      const fromPos = getTerminalPosition(
        wire.from.componentId,
        wire.from.terminalName,
      );
      const toPos = getTerminalPosition(
        wire.to.componentId,
        wire.to.terminalName,
      );

      if (!fromPos || !toPos) return null;

      const context: RoutingContext = {
        obstacles,
        existingRoutes,
      };

      // Try A* pathfinding
      let path = findOrthogonalPath(fromPos, toPos, context);

      // Fall back to simple L-path if A* fails
      if (!path) {
        path = createFallbackPath(fromPos, toPos);
      }

      return path;
    },
    [obstacles, getTerminalPosition],
  );

  // Compute all routes
  const computeAllRoutes = useCallback((): Map<string, RoutePoint[]> => {
    const routes = new Map<string, RoutePoint[]>();
    const completedRoutes: WireRoute[] = [];

    for (const wire of wires) {
      const path = routeWire(wire, completedRoutes);
      if (path) {
        routes.set(wire.id, path);
        completedRoutes.push({ wireId: wire.id, points: path });
      }
    }

    return routes;
  }, [wires, routeWire]);

  // Generate a signature for component positions to detect changes
  const componentSignature = useMemo(() => {
    return components
      .map((c) => `${c.id}:${c.position.x},${c.position.y}`)
      .sort()
      .join("|");
  }, [components]);

  // Wire signature to detect wire changes
  const wireSignature = useMemo(() => {
    return wires
      .map(
        (w) =>
          `${w.id}:${w.from.componentId}-${w.from.terminalName}->${w.to.componentId}-${w.to.terminalName}`,
      )
      .sort()
      .join("|");
  }, [wires]);

  // Trigger re-routing when components or wires change
  useEffect(() => {
    const doUpdate = () => {
      // Clear cache when structure changes significantly
      if (prevComponentsRef.current !== componentSignature) {
        routeCacheRef.current.clear();
        prevComponentsRef.current = componentSignature;
      }

      setUpdateTrigger((t) => t + 1);
    };

    if (isDragging) {
      // Debounce during drag
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(
        doUpdate,
        ROUTING_CONSTANTS.DEBOUNCE_MS,
      );
    } else {
      // Immediate update when not dragging
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      doUpdate();
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [componentSignature, wireSignature, isDragging]);

  // Compute routes (memoized, updates when trigger changes)
  const routes = useMemo(() => {
    // Depend on updateTrigger to force recalculation
    void updateTrigger;
    return computeAllRoutes();
  }, [computeAllRoutes, updateTrigger]);

  // Force re-route a specific wire
  const rerouteWire = useCallback((wireId: string) => {
    routeCacheRef.current.delete(wireId);
    setUpdateTrigger((t) => t + 1);
  }, []);

  // Force re-route all wires
  const rerouteAll = useCallback(() => {
    routeCacheRef.current.clear();
    setUpdateTrigger((t) => t + 1);
  }, []);

  return {
    routes,
    rerouteWire,
    rerouteAll,
  };
}
