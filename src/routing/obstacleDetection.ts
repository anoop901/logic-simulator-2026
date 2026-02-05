/**
 * Obstacle detection utilities for wire routing.
 * Converts components to rectangular obstacles for pathfinding.
 */

import type { LogicComponent } from "../types/LogicComponent";
import getComponentGeometry from "../components/getComponentGeometry";
import type { Rectangle } from "./WireRouting";
import { ROUTING_CONSTANTS } from "./routingConstants";

/**
 * Get a rectangular obstacle from a component's geometry.
 * The rectangle is in absolute canvas coordinates and includes a margin.
 */
export function getComponentObstacle(
  component: LogicComponent,
  margin: number = ROUTING_CONSTANTS.COMPONENT_MARGIN,
): Rectangle {
  const geo = getComponentGeometry(component);

  return {
    x: component.position.x + geo.leftX - margin,
    y: component.position.y + geo.topY - margin,
    width: geo.width + 2 * margin,
    height: geo.height + 2 * margin,
  };
}

/**
 * Build a list of obstacles from all components.
 */
export function buildObstacleList(
  components: LogicComponent[],
  margin: number = ROUTING_CONSTANTS.COMPONENT_MARGIN,
): Rectangle[] {
  return components.map((component) => getComponentObstacle(component, margin));
}

/**
 * Check if a point is inside a rectangle.
 */
export function pointInRectangle(
  x: number,
  y: number,
  rect: Rectangle,
): boolean {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
}

/**
 * Check if a horizontal or vertical line segment intersects a rectangle.
 * The segment must be axis-aligned (either x1 === x2 or y1 === y2).
 */
export function segmentIntersectsRectangle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rect: Rectangle,
): boolean {
  // Ensure proper ordering
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  // Check if the line segment's bounding box intersects the rectangle
  if (
    maxX < rect.x ||
    minX > rect.x + rect.width ||
    maxY < rect.y ||
    minY > rect.y + rect.height
  ) {
    return false;
  }

  // For axis-aligned segments, bounding box intersection is sufficient
  return true;
}

/**
 * Check if a path (list of points) is clear of all obstacles.
 * The path is assumed to be orthogonal (horizontal/vertical segments only).
 */
export function isPathClear(
  points: { x: number; y: number }[],
  obstacles: Rectangle[],
): boolean {
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    for (const obstacle of obstacles) {
      if (segmentIntersectsRectangle(p1.x, p1.y, p2.x, p2.y, obstacle)) {
        return false;
      }
    }
  }
  return true;
}
