/**
 * Wire conflict detection and lane assignment.
 * Prevents wires from overlapping by assigning them to different "lanes".
 */

import type { RoutePoint, WireRoute } from "./WireRouting";
import { ROUTING_CONSTANTS } from "./routingConstants";

/**
 * Represents a segment of a wire route.
 */
interface Segment {
  p1: RoutePoint;
  p2: RoutePoint;
  isHorizontal: boolean;
}

/**
 * Check if two segments overlap (parallel and coincident).
 */
function segmentsOverlap(s1: Segment, s2: Segment): boolean {
  // Must have same orientation
  if (s1.isHorizontal !== s2.isHorizontal) return false;

  const tolerance = ROUTING_CONSTANTS.OVERLAP_TOLERANCE;

  if (s1.isHorizontal) {
    // Both horizontal - check if Y values are close and X ranges overlap
    if (Math.abs(s1.p1.y - s2.p1.y) > tolerance) return false;

    const s1MinX = Math.min(s1.p1.x, s1.p2.x);
    const s1MaxX = Math.max(s1.p1.x, s1.p2.x);
    const s2MinX = Math.min(s2.p1.x, s2.p2.x);
    const s2MaxX = Math.max(s2.p1.x, s2.p2.x);

    return s1MaxX > s2MinX && s2MaxX > s1MinX;
  } else {
    // Both vertical - check if X values are close and Y ranges overlap
    if (Math.abs(s1.p1.x - s2.p1.x) > tolerance) return false;

    const s1MinY = Math.min(s1.p1.y, s1.p2.y);
    const s1MaxY = Math.max(s1.p1.y, s1.p2.y);
    const s2MinY = Math.min(s2.p1.y, s2.p2.y);
    const s2MaxY = Math.max(s2.p1.y, s2.p2.y);

    return s1MaxY > s2MinY && s2MaxY > s1MinY;
  }
}

/**
 * Extract segments from a route.
 */
function getRouteSegments(route: WireRoute): Segment[] {
  const segments: Segment[] = [];

  for (let i = 0; i < route.points.length - 1; i++) {
    const p1 = route.points[i];
    const p2 = route.points[i + 1];
    const isHorizontal = p1.y === p2.y;

    segments.push({ p1, p2, isHorizontal });
  }

  return segments;
}

/**
 * Check if a segment conflicts with any existing route.
 */
export function doesSegmentConflict(
  segment: [RoutePoint, RoutePoint],
  existingRoutes: WireRoute[],
): boolean {
  const testSegment: Segment = {
    p1: segment[0],
    p2: segment[1],
    isHorizontal: segment[0].y === segment[1].y,
  };

  for (const route of existingRoutes) {
    const routeSegments = getRouteSegments(route);
    for (const existingSegment of routeSegments) {
      if (segmentsOverlap(testSegment, existingSegment)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Get the lane offset for a segment to avoid overlapping with existing routes.
 * Returns an offset in pixels that should be applied perpendicular to the segment.
 */
export function assignWireLane(
  segment: [RoutePoint, RoutePoint],
  existingRoutes: WireRoute[],
): number {
  const testSegment: Segment = {
    p1: segment[0],
    p2: segment[1],
    isHorizontal: segment[0].y === segment[1].y,
  };

  // Find all overlapping segments and their offsets
  const usedOffsets = new Set<number>();
  usedOffsets.add(0); // Current segment would be at offset 0

  for (const route of existingRoutes) {
    const routeSegments = getRouteSegments(route);
    for (const existingSegment of routeSegments) {
      if (segmentsOverlap(testSegment, existingSegment)) {
        // Calculate what offset this existing segment is using
        if (testSegment.isHorizontal) {
          const offset = existingSegment.p1.y - testSegment.p1.y;
          usedOffsets.add(Math.round(offset / ROUTING_CONSTANTS.WIRE_SPACING));
        } else {
          const offset = existingSegment.p1.x - testSegment.p1.x;
          usedOffsets.add(Math.round(offset / ROUTING_CONSTANTS.WIRE_SPACING));
        }
      }
    }
  }

  // Find the first available lane
  for (let lane = 0; lane <= ROUTING_CONSTANTS.MAX_LANES; lane++) {
    if (!usedOffsets.has(lane)) {
      return lane * ROUTING_CONSTANTS.WIRE_SPACING;
    }
    if (!usedOffsets.has(-lane)) {
      return -lane * ROUTING_CONSTANTS.WIRE_SPACING;
    }
  }

  // Fallback: use next available positive lane
  return usedOffsets.size * ROUTING_CONSTANTS.WIRE_SPACING;
}

/**
 * Apply lane offsets to a route to avoid overlapping with existing routes.
 * Returns a new route with adjusted points.
 */
export function applyLaneOffsets(
  route: WireRoute,
  existingRoutes: WireRoute[],
): WireRoute {
  if (route.points.length < 2) return route;

  const newPoints: RoutePoint[] = [route.points[0]];

  for (let i = 0; i < route.points.length - 1; i++) {
    const p1 = route.points[i];
    const p2 = route.points[i + 1];
    const segment: [RoutePoint, RoutePoint] = [p1, p2];

    const laneOffset = assignWireLane(segment, existingRoutes);

    if (laneOffset !== 0) {
      const isHorizontal = p1.y === p2.y;

      if (isHorizontal) {
        // Offset in Y direction for horizontal segments
        newPoints[newPoints.length - 1] = {
          ...newPoints[newPoints.length - 1],
          y: newPoints[newPoints.length - 1].y + laneOffset,
        };
        newPoints.push({ x: p2.x, y: p2.y + laneOffset });
      } else {
        // Offset in X direction for vertical segments
        newPoints[newPoints.length - 1] = {
          ...newPoints[newPoints.length - 1],
          x: newPoints[newPoints.length - 1].x + laneOffset,
        };
        newPoints.push({ x: p2.x + laneOffset, y: p2.y });
      }
    } else {
      newPoints.push(p2);
    }
  }

  return { wireId: route.wireId, points: newPoints };
}
