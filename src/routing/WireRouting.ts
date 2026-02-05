/**
 * Core types for wire routing.
 */

/** A point in 2D space */
export interface RoutePoint {
  x: number;
  y: number;
}

/** A computed route for a wire as an ordered list of waypoints */
export interface WireRoute {
  wireId: string;
  points: RoutePoint[];
}

/** A rectangular obstacle (component bounding box) */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Context for routing decisions */
export interface RoutingContext {
  /** Component bounding boxes as obstacles */
  obstacles: Rectangle[];
  /** Already-routed wires (for conflict avoidance) */
  existingRoutes: WireRoute[];
}

/** Direction of movement in orthogonal routing */
export type Direction = "up" | "down" | "left" | "right" | null;

/** A node in the A* search graph */
export interface PathNode {
  point: RoutePoint;
  /** Cost from start */
  g: number;
  /** Heuristic (Manhattan distance to goal) */
  h: number;
  /** Total cost: g + h */
  f: number;
  /** Parent node for path reconstruction */
  parent: PathNode | null;
  /** Number of direction changes */
  turns: number;
  /** Current direction of travel */
  direction: Direction;
}
