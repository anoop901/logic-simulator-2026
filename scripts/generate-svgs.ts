/**
 * Node script to generate SVG files for all component menu options.
 *
 * This script reads component definitions, renders each component using its
 * corresponding renderer, and saves the SVG output to src/assets.
 *
 * Run with: npx tsx --tsconfig scripts/tsconfig.json scripts/generate-svgs.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import ReactDOMServer from "react-dom/server";

import COMPONENT_MENU_OPTIONS, {
  nameToIconFilename,
} from "../src/componentMenuOptions.js";

import renderComponent from "../src/components/renderComponent.js";
import visitComponent from "../src/components/visitComponent.js";
import type { LogicComponent } from "../src/types/LogicComponent.js";

type Dimensions = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

// Get component dimensions for viewBox calculation
function getComponentDimensions(component: LogicComponent): Dimensions {
  return visitComponent(component, {
    visitGate(opts) {
      const height = opts.numberOfInputs * 15 + 16;
      const hasInversion =
        opts.type === "NAND" || opts.type === "NOR" || opts.type === "XNOR";
      const hasXor = opts.type === "XOR" || opts.type === "XNOR";
      return {
        width: 60 + (hasInversion ? 10 : 0) + (hasXor ? 8 : 0),
        height,
        offsetX: 30 + (hasXor ? 8 : 0),
        offsetY: height / 2,
      };
    },
    visitNot() {
      return { width: 60, height: 40, offsetX: 25, offsetY: 20 };
    },
    visitMux(opts) {
      const numInputs = Math.pow(2, opts.selectBits);
      const height = Math.max(50, numInputs * 15 + 20);
      return { width: 60, height, offsetX: 30, offsetY: height / 2 };
    },
    visitDecoder(opts) {
      const numOutputs = Math.pow(2, opts.inputBits);
      const height = Math.max(50, numOutputs * 15 + 20);
      return { width: 60, height, offsetX: 30, offsetY: height / 2 };
    },
    visitAdder() {
      return { width: 50, height: 110, offsetX: 25, offsetY: 55 };
    },
    visitRegister(opts) {
      const width = opts.bitWidth > 1 ? 90 : 60;
      return { width, height: 50, offsetX: width / 2, offsetY: 25 };
    },
    visitMemory() {
      return { width: 90, height: 80, offsetX: 45, offsetY: 40 };
    },
    visitConstant() {
      return { width: 60, height: 40, offsetX: 30, offsetY: 20 };
    },
  });
}

// Main function
function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const assetsDir = path.resolve(__dirname, "../src/assets");

  // Track unique icons (avoid generating duplicates)
  const generatedIcons = new Set<string>();

  console.log("Generating SVG icons for component menu options...\n");

  for (const definition of COMPONENT_MENU_OPTIONS) {
    const filename = nameToIconFilename(definition.name);

    // Skip if we already generated this icon
    if (generatedIcons.has(filename)) {
      console.log(`  Skipping ${filename} (duplicate)`);
      continue;
    }

    const logicComponent: LogicComponent = {
      kind: definition.kind,
      options: definition.options,
      id: "",
      position: { x: 0, y: 0 },
    };

    const renderedComponent = renderComponent(logicComponent);
    if (!renderedComponent) {
      console.warn(`  Warning: No renderer for kind "${definition.kind}"`);
      continue;
    }

    const dims = getComponentDimensions(logicComponent);
    const padding = 5;

    // Wrap the component in an SVG with appropriate viewBox
    const svg = React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: `${-dims.offsetX - padding} ${-dims.offsetY - padding} ${
          dims.width + padding * 2
        } ${dims.height + padding * 2}`,
        width: dims.width + padding * 2,
        height: dims.height + padding * 2,
      },
      renderedComponent,
    );

    // Render to string
    const svgString = ReactDOMServer.renderToStaticMarkup(svg);

    // Write to file
    const outputPath = path.join(assetsDir, filename);
    fs.writeFileSync(outputPath, svgString, "utf-8");

    console.log(`  Generated: ${filename}`);
    generatedIcons.add(filename);
  }

  console.log(`\nDone! Generated ${generatedIcons.size} SVG icons.`);
}

main();
