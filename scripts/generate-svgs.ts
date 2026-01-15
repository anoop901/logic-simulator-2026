/**
 * Node script to generate SVG files for all component menu options.
 *
 * This script reads component definitions, renders each component using its
 * corresponding renderer, and saves the SVG output to src/assets.
 *
 * Run with: npx tsx scripts/generate-svgs.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import ReactDOMServer from "react-dom/server";

// Import component renderers
import GateRenderer from "../src/components/GateRenderer.js";
import NotRenderer from "../src/components/NotRenderer.js";
import MuxRenderer from "../src/components/MuxRenderer.js";
import DecoderRenderer from "../src/components/DecoderRenderer.js";
import AdderRenderer from "../src/components/AdderRenderer.js";
import RegisterRenderer from "../src/components/RegisterRenderer.js";
import MemoryRenderer from "../src/components/MemoryRenderer.js";

import COMPONENT_MENU_OPTIONS, {
  nameToIconFilename,
} from "../src/componentMenuOptions.js";

// Import types
import type {
  GateComponentOptions,
  NotComponentOptions,
  MuxComponentOptions,
  DecoderComponentOptions,
  AdderComponentOptions,
  RegisterComponentOptions,
  MemoryComponentOptions,
  ComponentOptions,
} from "../src/types/LogicComponent.js";

// Get component dimensions for viewBox calculation
function getComponentDimensions(
  kind: string,
  options: ComponentOptions
): { width: number; height: number; offsetX: number; offsetY: number } {
  switch (kind) {
    case "gate": {
      const opts = options as GateComponentOptions;
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
    }
    case "not":
      return { width: 60, height: 40, offsetX: 25, offsetY: 20 };
    case "mux": {
      const opts = options as MuxComponentOptions;
      const numInputs = Math.pow(2, opts.selectBits);
      const height = Math.max(50, numInputs * 15 + 20);
      return { width: 60, height, offsetX: 30, offsetY: height / 2 };
    }
    case "decoder": {
      const opts = options as DecoderComponentOptions;
      const numOutputs = Math.pow(2, opts.inputBits);
      const height = Math.max(50, numOutputs * 15 + 20);
      return { width: 60, height, offsetX: 30, offsetY: height / 2 };
    }
    case "adder":
      return { width: 50, height: 110, offsetX: 25, offsetY: 55 };
    case "register": {
      const opts = options as RegisterComponentOptions;
      const width = opts.bitWidth > 1 ? 90 : 60;
      return { width, height: 50, offsetX: width / 2, offsetY: 25 };
    }
    case "memory":
      return { width: 90, height: 80, offsetX: 45, offsetY: 40 };
    default:
      return { width: 80, height: 60, offsetX: 40, offsetY: 30 };
  }
}

// Render component based on kind
function renderComponent(
  kind: string,
  options: ComponentOptions
): React.ReactElement | null {
  switch (kind) {
    case "gate":
      return React.createElement(GateRenderer, {
        x: 0,
        y: 0,
        options: options as GateComponentOptions,
      });
    case "not":
      return React.createElement(NotRenderer, {
        x: 0,
        y: 0,
        options: options as NotComponentOptions,
      });
    case "mux":
      return React.createElement(MuxRenderer, {
        x: 0,
        y: 0,
        options: options as MuxComponentOptions,
      });
    case "decoder":
      return React.createElement(DecoderRenderer, {
        x: 0,
        y: 0,
        options: options as DecoderComponentOptions,
      });
    case "adder":
      return React.createElement(AdderRenderer, {
        x: 0,
        y: 0,
        options: options as AdderComponentOptions,
      });
    case "register":
      return React.createElement(RegisterRenderer, {
        x: 0,
        y: 0,
        options: options as RegisterComponentOptions,
      });
    case "memory":
      return React.createElement(MemoryRenderer, {
        x: 0,
        y: 0,
        options: options as MemoryComponentOptions,
      });
    default:
      return null;
  }
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

    const component = renderComponent(definition.kind, definition.options);
    if (!component) {
      console.warn(`  Warning: No renderer for kind "${definition.kind}"`);
      continue;
    }

    const dims = getComponentDimensions(definition.kind, definition.options);
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
      component
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
