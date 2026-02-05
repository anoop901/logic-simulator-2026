import type { SplitterMergerComponentOptions } from "../types/LogicComponent";
import type Position from "../types/Position";
import type { TerminalInfo } from "./terminalInfoOfComponent";

const BAR_WIDTH = 8;
const TERMINAL_SPACING = 15;
const TERMINAL_EXTENSION = 20;

/**
 * Calculate the bit ranges for splitter/merger terminals.
 * Returns array of {startBit, endBit} for each chunk, ordered from high to low.
 * Chunks are LSB-aligned: full-size chunks start from bit 0, with any
 * remainder chunk at the high-order end.
 */
function getChunks(
  inputBitWidth: number,
  outputBitWidth: number,
): { startBit: number; endBit: number }[] {
  const largerWidth = Math.max(inputBitWidth, outputBitWidth);
  const smallerWidth = Math.min(inputBitWidth, outputBitWidth);

  if (smallerWidth <= 0 || largerWidth <= 0) {
    return [{ startBit: largerWidth - 1, endBit: 0 }];
  }

  // LSB-aligned: start from bit 0 with full chunks, remainder at high end
  const fullChunks = Math.floor(largerWidth / smallerWidth);
  const remainderBits = largerWidth % smallerWidth;

  const chunks: { startBit: number; endBit: number }[] = [];

  // Add remainder chunk first (high-order bits) if it exists
  if (remainderBits > 0) {
    chunks.push({
      startBit: largerWidth - 1,
      endBit: largerWidth - remainderBits,
    });
  }

  // Add full-size chunks from high to low
  for (let i = fullChunks - 1; i >= 0; i--) {
    chunks.push({
      startBit: (i + 1) * smallerWidth - 1,
      endBit: i * smallerWidth,
    });
  }

  return chunks;
}

/**
 * Format using bit range notation.
 * Examples: "7:0", "19:16", "0" (single bit)
 */
export function formatBitRange(startBit: number, endBit: number): string {
  if (startBit === endBit) {
    return `${startBit}`;
  }
  return `${startBit}:${endBit}`;
}

/**
 * Format a terminal name using bit range notation.
 * Examples: "in7:0", "out19:16", "in0" (single bit)
 */
function formatTerminalName(
  prefix: string,
  startBit: number,
  endBit: number,
): string {
  return `${prefix}${formatBitRange(startBit, endBit)}`;
}

/**
 * Determine if this is splitter mode (one input, many outputs) or merger mode.
 */
function isSplitterMode(
  inputBitWidth: number,
  outputBitWidth: number,
): boolean {
  return inputBitWidth >= outputBitWidth;
}

/**
 * Get the geometry for a splitter/merger component.
 */
export function getSplitterMergerGeometry(
  inputBitWidth: number,
  outputBitWidth: number,
) {
  const chunks = getChunks(inputBitWidth, outputBitWidth);
  const numTerminals = Math.max(chunks.length, 1);

  const height = Math.max(
    50,
    (numTerminals - 1) * TERMINAL_SPACING + TERMINAL_EXTENSION * 2,
  );
  const halfW = BAR_WIDTH / 2;
  const halfH = height / 2;

  // Calculate Y positions for multi-terminal side
  const totalHeight = (numTerminals - 1) * TERMINAL_SPACING;
  const terminalYPositions: number[] = [];
  for (let i = 0; i < numTerminals; i++) {
    terminalYPositions.push(-totalHeight / 2 + i * TERMINAL_SPACING);
  }

  return {
    chunks,
    terminalYPositions,
    isSplitter: isSplitterMode(inputBitWidth, outputBitWidth),
    // Standard geometry
    leftX: -halfW,
    rightX: halfW,
    topY: -halfH,
    bottomY: halfH,
    width: BAR_WIDTH,
    height,
    centerX: 0,
    centerY: 0,
  };
}

/**
 * Get terminal info for a splitter/merger component.
 */
export function terminalInfoOfSplitterMerger(
  position: Position,
  options: SplitterMergerComponentOptions,
): TerminalInfo[] {
  const { inputBitWidth, outputBitWidth } = options;
  const geo = getSplitterMergerGeometry(inputBitWidth, outputBitWidth);
  const result: TerminalInfo[] = [];

  // Splitter mode: one input (left), multiple outputs (right)
  // Single input terminal
  const singleTerminalSideDirection = geo.isSplitter ? "in" : "out";
  const multiTerminalSideDirection = geo.isSplitter ? "out" : "in";
  const directionToX = { out: geo.rightX, in: geo.leftX };
  result.push({
    name: formatTerminalName(singleTerminalSideDirection, inputBitWidth - 1, 0),
    direction: singleTerminalSideDirection,
    position: {
      x: position.x + directionToX[singleTerminalSideDirection],
      y: position.y,
    },
  });

  // Multiple output terminals
  for (let i = 0; i < geo.chunks.length; i++) {
    const chunk = geo.chunks[i];
    result.push({
      name: formatTerminalName(
        multiTerminalSideDirection,
        chunk.startBit,
        chunk.endBit,
      ),
      direction: multiTerminalSideDirection,
      position: {
        x: position.x + directionToX[multiTerminalSideDirection],
        y: position.y + geo.terminalYPositions[i],
      },
    });
  }

  return result;
}

/**
 * Simulate a splitter/merger component.
 * @param options The component options
 * @param inputs Map of input terminal names to values
 * @returns Map of output terminal names to values
 */
export function simulateSplitterMerger(
  options: SplitterMergerComponentOptions,
  inputs: Map<string, bigint>,
): Map<string, bigint> {
  const { inputBitWidth, outputBitWidth } = options;
  const geo = getSplitterMergerGeometry(inputBitWidth, outputBitWidth);
  const outputs = new Map<string, bigint>();

  if (geo.isSplitter) {
    // Splitter: extract chunks from single input
    const inputName = formatTerminalName("in", inputBitWidth - 1, 0);
    const inputValue = inputs.get(inputName) ?? 0n;

    for (const chunk of geo.chunks) {
      const outputName = formatTerminalName(
        "out",
        chunk.startBit,
        chunk.endBit,
      );
      const chunkWidth = chunk.startBit - chunk.endBit + 1;
      const mask = (1n << BigInt(chunkWidth)) - 1n;
      const shiftAmount = BigInt(chunk.endBit);
      const chunkValue = (inputValue >> shiftAmount) & mask;
      outputs.set(outputName, chunkValue);
    }
  } else {
    // Merger: combine multiple inputs into single output
    let outputValue = 0n;

    for (const chunk of geo.chunks) {
      const inputName = formatTerminalName("in", chunk.startBit, chunk.endBit);
      const inputValue = inputs.get(inputName) ?? 0n;
      const chunkWidth = chunk.startBit - chunk.endBit + 1;
      const mask = (1n << BigInt(chunkWidth)) - 1n;
      const shiftAmount = BigInt(chunk.endBit);
      outputValue |= (inputValue & mask) << shiftAmount;
    }

    const outputName = formatTerminalName("out", outputBitWidth - 1, 0);
    outputs.set(outputName, outputValue);
  }

  return outputs;
}
