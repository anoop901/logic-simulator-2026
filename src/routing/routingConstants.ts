/**
 * Routing constants for wire pathfinding and layout.
 */
export const ROUTING_CONSTANTS = {
  /** Minimum distance from component bounding boxes */
  COMPONENT_MARGIN: 10,

  /** Minimum spacing between parallel wires */
  WIRE_SPACING: 8,

  /** A* cost penalty per turn (encourages simpler paths) */
  TURN_PENALTY: 20,

  /** A* cost for being near other wires */
  PROXIMITY_PENALTY: 5,

  /** A* early termination threshold */
  MAX_SEARCH_ITERATIONS: 5000,

  /** Debounce delay for re-routing during drag (ms) */
  DEBOUNCE_MS: 100,

  /** Maximum number of parallel wire lanes */
  MAX_LANES: 5,

  /** Tolerance for detecting overlapping segments (px) */
  OVERLAP_TOLERANCE: 3,
};
