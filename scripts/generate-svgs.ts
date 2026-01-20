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
import getComponentGeometry from "../src/components/getComponentGeometry.js";
import type { LogicComponent } from "../src/types/LogicComponent.js";

type Dimensions = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

// Get component dimensions for viewBox calculation
function getComponentDimensions(component: LogicComponent): Dimensions {
  const geo = getComponentGeometry(component);
  return {
    width: geo.width,
    height: geo.height,
    offsetX: -geo.leftX,
    offsetY: -geo.topY,
  };
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
