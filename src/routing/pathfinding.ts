/**
 * A* pathfinding algorithm for orthogonal wire routing.
 * Uses a sparse navigation graph approach for efficiency.
 */

import type {
  RoutePoint,
  Rectangle,
  PathNode,
  Direction,
  RoutingContext,
} from "./WireRouting";
import { ROUTING_CONSTANTS } from "./routingConstants";
import { segmentIntersectsRectangle } from "./obstacleDetection";

/**
 * Calculate Manhattan distance between two points.
 */
function manhattanDistance(a: RoutePoint, b: RoutePoint): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Get the direction from one point to another.
 */
function getDirection(from: RoutePoint, to: RoutePoint): Direction {
  if (to.x > from.x) return "right";
  if (to.x < from.x) return "left";
  if (to.y > from.y) return "down";
  if (to.y < from.y) return "up";
  return null;
}

/**
 * Check if moving in this direction causes a turn from previous direction.
 */
function isTurn(prevDirection: Direction, newDirection: Direction): boolean {
  if (prevDirection === null || newDirection === null) return false;
  return prevDirection !== newDirection;
}

/**
 * Generate a unique key for a point (for visited set).
 */
function pointKey(p: RoutePoint): string {
  return `${p.x},${p.y}`;
}

/**
 * Check if moving from p1 to p2 would intersect any obstacles.
 */
function segmentClear(
  p1: RoutePoint,
  p2: RoutePoint,
  obstacles: Rectangle[],
): boolean {
  for (const obstacle of obstacles) {
    if (segmentIntersectsRectangle(p1.x, p1.y, p2.x, p2.y, obstacle)) {
      return false;
    }
  }
  return true;
}

/**
 * Generate navigation waypoints from obstacles and terminals.
 * Creates a sparse set of points at obstacle corners and terminal positions.
 */
export function generateNavigationPoints(
  start: RoutePoint,
  end: RoutePoint,
  obstacles: Rectangle[],
  margin: number = ROUTING_CONSTANTS.COMPONENT_MARGIN,
): RoutePoint[] {
  const points: RoutePoint[] = [start, end];
  const pointSet = new Set<string>();
  pointSet.add(pointKey(start));
  pointSet.add(pointKey(end));

  // Add corner points around each obstacle
  for (const rect of obstacles) {
    const corners = [
      { x: rect.x - margin, y: rect.y - margin },
      { x: rect.x + rect.width + margin, y: rect.y - margin },
      { x: rect.x - margin, y: rect.y + rect.height + margin },
      { x: rect.x + rect.width + margin, y: rect.y + rect.height + margin },
    ];

    for (const corner of corners) {
      const key = pointKey(corner);
      if (!pointSet.has(key)) {
        pointSet.add(key);
        points.push(corner);
      }
    }
  }

  // Add intermediate points on horizontal/vertical lines through start and end
  // This helps create orthogonal paths
  const horizontalYs = new Set([start.y, end.y]);
  const verticalXs = new Set([start.x, end.x]);

  for (const rect of obstacles) {
    horizontalYs.add(rect.y - margin);
    horizontalYs.add(rect.y + rect.height + margin);
    verticalXs.add(rect.x - margin);
    verticalXs.add(rect.x + rect.width + margin);
  }

  // Add intersection points of horizontal/vertical lines
  for (const x of verticalXs) {
    for (const y of horizontalYs) {
      const key = pointKey({ x, y });
      if (!pointSet.has(key)) {
        // Check if point is inside any obstacle
        let insideObstacle = false;
        for (const rect of obstacles) {
          if (
            x > rect.x &&
            x < rect.x + rect.width &&
            y > rect.y &&
            y < rect.y + rect.height
          ) {
            insideObstacle = true;
            break;
          }
        }
        if (!insideObstacle) {
          pointSet.add(key);
          points.push({ x, y });
        }
      }
    }
  }

  return points;
}

/**
 * Get valid neighbors for a point (orthogonal moves only).
 * Uses the navigation points as potential destinations.
 */
function getNeighbors(
  current: RoutePoint,
  navPoints: RoutePoint[],
  obstacles: Rectangle[],
): RoutePoint[] {
  const neighbors: RoutePoint[] = [];

  for (const point of navPoints) {
    // Skip if same point
    if (point.x === current.x && point.y === current.y) continue;

    // Only consider orthogonal moves (same x or same y)
    if (point.x !== current.x && point.y !== current.y) continue;

    // Check if path is clear
    if (segmentClear(current, point, obstacles)) {
      neighbors.push(point);
    }
  }

  return neighbors;
}

/**
 * Reconstruct the path from goal node back to start.
 */
function reconstructPath(node: PathNode): RoutePoint[] {
  const path: RoutePoint[] = [];
  let current: PathNode | null = node;

  while (current !== null) {
    path.unshift(current.point);
    current = current.parent;
  }

  return path;
}

/**
 * Simplify path by removing redundant points (collinear points).
 */
function simplifyPath(path: RoutePoint[]): RoutePoint[] {
  if (path.length <= 2) return path;

  const simplified: RoutePoint[] = [path[0]];

  for (let i = 1; i < path.length - 1; i++) {
    const prev = simplified[simplified.length - 1];
    const curr = path[i];
    const next = path[i + 1];

    // Keep point if direction changes (it's a corner)
    const sameX = prev.x === curr.x && curr.x === next.x;
    const sameY = prev.y === curr.y && curr.y === next.y;

    if (!sameX && !sameY) {
      simplified.push(curr);
    }
  }

  simplified.push(path[path.length - 1]);
  return simplified;
}

/**
 * Calculate additional cost for wire proximity (to avoid parallel overlap).
 */
function calculateProximityCost(
  segment: [RoutePoint, RoutePoint],
  existingRoutes: { points: RoutePoint[] }[],
): number {
  let cost = 0;

  for (const route of existingRoutes) {
    for (let i = 0; i < route.points.length - 1; i++) {
      const existingSegment: [RoutePoint, RoutePoint] = [
        route.points[i],
        route.points[i + 1],
      ];

      // Check if segments are parallel and close
      if (areSegmentsParallel(segment, existingSegment)) {
        const distance = segmentDistance(segment, existingSegment);
        if (distance < ROUTING_CONSTANTS.WIRE_SPACING * 2) {
          cost += ROUTING_CONSTANTS.PROXIMITY_PENALTY;
        }
      }
    }
  }

  return cost;
}

/**
 * Check if two segments are parallel (both horizontal or both vertical).
 */
function areSegmentsParallel(
  s1: [RoutePoint, RoutePoint],
  s2: [RoutePoint, RoutePoint],
): boolean {
  const s1Horizontal = s1[0].y === s1[1].y;
  const s2Horizontal = s2[0].y === s2[1].y;
  const s1Vertical = s1[0].x === s1[1].x;
  const s2Vertical = s2[0].x === s2[1].x;

  return (s1Horizontal && s2Horizontal) || (s1Vertical && s2Vertical);
}

/**
 * Calculate distance between two parallel segments.
 */
function segmentDistance(
  s1: [RoutePoint, RoutePoint],
  s2: [RoutePoint, RoutePoint],
): number {
  // For horizontal segments, compare Y values
  if (s1[0].y === s1[1].y && s2[0].y === s2[1].y) {
    return Math.abs(s1[0].y - s2[0].y);
  }
  // For vertical segments, compare X values
  if (s1[0].x === s1[1].x && s2[0].x === s2[1].x) {
    return Math.abs(s1[0].x - s2[0].x);
  }
  return Infinity;
}

/**
 * Find the shortest orthogonal path between two points using A*.
 */
export function findOrthogonalPath(
  start: RoutePoint,
  end: RoutePoint,
  context: RoutingContext,
): RoutePoint[] | null {
  const { obstacles, existingRoutes } = context;

  // Generate navigation points
  const navPoints = generateNavigationPoints(start, end, obstacles);

  // Initialize open set with start node
  const openSet: PathNode[] = [
    {
      point: start,
      g: 0,
      h: manhattanDistance(start, end),
      f: manhattanDistance(start, end),
      parent: null,
      turns: 0,
      direction: null,
    },
  ];

  const closedSet = new Set<string>();
  const gScores = new Map<string, number>();
  gScores.set(pointKey(start), 0);

  let iterations = 0;

  while (
    openSet.length > 0 &&
    iterations < ROUTING_CONSTANTS.MAX_SEARCH_ITERATIONS
  ) {
    iterations++;

    // Find node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    const currentKey = pointKey(current.point);

    // Check if we reached the goal
    if (current.point.x === end.x && current.point.y === end.y) {
      return simplifyPath(reconstructPath(current));
    }

    closedSet.add(currentKey);

    // Explore neighbors
    const neighbors = getNeighbors(current.point, navPoints, obstacles);

    for (const neighbor of neighbors) {
      const neighborKey = pointKey(neighbor);

      if (closedSet.has(neighborKey)) continue;

      const direction = getDirection(current.point, neighbor);
      const turnPenalty = isTurn(current.direction, direction)
        ? ROUTING_CONSTANTS.TURN_PENALTY
        : 0;

      // Calculate proximity cost for this segment
      const proximityCost = calculateProximityCost(
        [current.point, neighbor],
        existingRoutes,
      );

      const moveCost = manhattanDistance(current.point, neighbor);
      const tentativeG = current.g + moveCost + turnPenalty + proximityCost;

      const existingG = gScores.get(neighborKey);
      if (existingG !== undefined && tentativeG >= existingG) continue;

      gScores.set(neighborKey, tentativeG);

      const h = manhattanDistance(neighbor, end);
      const newNode: PathNode = {
        point: neighbor,
        g: tentativeG,
        h,
        f: tentativeG + h,
        parent: current,
        turns: current.turns + (isTurn(current.direction, direction) ? 1 : 0),
        direction,
      };

      // Remove existing node with higher cost if present
      const existingIndex = openSet.findIndex(
        (n) => pointKey(n.point) === neighborKey,
      );
      if (existingIndex >= 0) {
        openSet.splice(existingIndex, 1);
      }

      openSet.push(newNode);
    }
  }

  // No path found - return null
  return null;
}

/**
 * Create a fallback direct path when A* fails.
 * Returns a simple L-shaped path.
 */
export function createFallbackPath(
  start: RoutePoint,
  end: RoutePoint,
): RoutePoint[] {
  // Try horizontal-first L-path
  const midPoint: RoutePoint = { x: end.x, y: start.y };

  return [start, midPoint, end];
}
