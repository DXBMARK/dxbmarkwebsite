"use client";

import * as React from "react";
import { integrationTiles } from "@/content/home/integrations";
import { IntegrationTile } from "./IntegrationTile";
import { IntegrationHubCard } from "./IntegrationHubCard";
import { IntegrationFlowPaths } from "./IntegrationFlowPaths";

const FLOW_WIDTH = 1200;
const FLOW_HEIGHT = 560;

interface IntegrationFlowMapProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function IntegrationFlowMap({ containerRef }: IntegrationFlowMapProps) {
  // Map our 10 nodes to exact coordinates inside the 1200x560 SVG grid.
  const nodePositionMap: Record<string, { x: number; y: number }> = {
    // Left
    "source-hubspot": { x: 260, y: 35 },
    "source-zapier": { x: 260, y: 160 },
    "source-shopify": { x: 260, y: 285 },
    "source-paypal": { x: 260, y: 410 },
    "source-cloud": { x: 260, y: 535 },

    // Right
    "dest-stripe": { x: 940, y: 35 },
    "dest-analytics": { x: 940, y: 160 },
    "dest-slack": { x: 940, y: 285 },
    "dest-whatsapp": { x: 940, y: 410 },
    "dest-telegram": { x: 940, y: 535 },
  };

  const sources = integrationTiles.filter((t) => t.group === "source");
  const destinations = integrationTiles.filter((t) => t.group === "destination");

  return (
    <div className="relative z-10 mx-auto h-full w-full max-w-[1120px] select-none">
      <IntegrationFlowPaths containerRef={containerRef} />

      {/* Input / Source tiles */}
      {sources.map((tile, idx) => {
        const pos = nodePositionMap[tile.id];

        if (!pos) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`[Integrations] Missing source position for tile: ${tile.id}`);
          }
          return null;
        }

        return (
          <div
            key={tile.id}
            className="absolute"
            style={{
              left: `${(pos.x / FLOW_WIDTH) * 100}%`,
              top: `${(pos.y / FLOW_HEIGHT) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <IntegrationTile item={tile} index={idx} />
          </div>
        );
      })}

      {/* Central processing hub card */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: `${(300 / FLOW_HEIGHT) * 100}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <IntegrationHubCard />
      </div>

      {/* Output / Destination tiles */}
      {destinations.map((tile, idx) => {
        const pos = nodePositionMap[tile.id];

        if (!pos) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`[Integrations] Missing destination position for tile: ${tile.id}`);
          }
          return null;
        }

        return (
          <div
            key={tile.id}
            className="absolute"
            style={{
              left: `${(pos.x / FLOW_WIDTH) * 100}%`,
              top: `${(pos.y / FLOW_HEIGHT) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <IntegrationTile item={tile} index={idx + 5} />
          </div>
        );
      })}
    </div>
  );
}
