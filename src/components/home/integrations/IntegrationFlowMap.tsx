"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { integrationTiles } from "@/content/home/integrations";
import { IntegrationTile } from "./IntegrationTile";
import { IntegrationHubCard } from "./IntegrationHubCard";
import { IntegrationFlowPaths } from "./IntegrationFlowPaths";

interface IntegrationFlowMapProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function IntegrationFlowMap({ containerRef }: IntegrationFlowMapProps) {
  const [expandedTile, setExpandedTile] = React.useState<string | null>(null);

  // Map our 12 nodes to exact coordinates inside the 1200x640 SVG grid
  const nodePositionMap: Record<string, { x: number; y: number }> = {
    // Sources (Left side - balanced vertical spacing)
    "source-forms": { x: 170, y: 120 },
    "source-crm": { x: 170, y: 200 },
    "source-email": { x: 170, y: 280 },
    "source-outlook": { x: 170, y: 360 },
    "source-shopify": { x: 170, y: 440 },
    "source-payments": { x: 170, y: 520 },

    // Destinations (Right side - balanced vertical spacing)
    "dest-dashboards": { x: 1030, y: 120 },
    "dest-tickets": { x: 1030, y: 200 },
    "dest-data": { x: 1030, y: 280 },
    "dest-notifications": { x: 1030, y: 360 },
    "dest-records": { x: 1030, y: 440 },
    "dest-reports": { x: 1030, y: 520 },
  };

  // Expanded Payments branch positioned below Payments parent (x=170, y=520)
  const subNodePositionMap: Record<string, { x: number; y: number }> = {
    "stripe": { x: 55, y: 585 },
    "paypal": { x: 130, y: 620 },
    "paymob": { x: 215, y: 620 },
    "tabby": { x: 295, y: 585 },
  };

  // Expanded CRM branch positioned left of CRM parent (x=170, y=200)
  const crmBranchPositionMap: Record<string, { x: number; y: number }> = {
    "hubspot": { x: 70, y: 120 },
    "salesforce": { x: 70, y: 200 },
    "zoho": { x: 70, y: 280 },
  };

  const premiumEase = [0.22, 1, 0.36, 1] as const;

  const sources = integrationTiles.filter((t) => t.group === "source");
  const destinations = integrationTiles.filter((t) => t.group === "destination");
  const paymentsTile = sources.find((s) => s.id === "source-payments");
  const crmTile = sources.find((s) => s.id === "source-crm");

  const handleTileClick = (tileId: string) => {
    setExpandedTile((prev) => (prev === tileId ? null : tileId));
  };

  return (
    <div className="relative w-full max-w-[1100px] aspect-[1200/640] mx-auto z-10 select-none">
      {/* SVG connection lines behind tiles (with active expanded state) */}
      <IntegrationFlowPaths containerRef={containerRef} expandedTile={expandedTile} />

      {/* Input / Source tiles */}
      {sources.map((tile, idx) => {
        const pos = nodePositionMap[tile.id] || { x: 170, y: 100 };
        const isExpanded = expandedTile === tile.id;

        return (
          <div
            key={tile.id}
            className="absolute"
            style={{
              left: `${(pos.x / 1200) * 100}%`,
              top: `${(pos.y / 640) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <IntegrationTile
              item={tile}
              index={idx}
              isExpanded={isExpanded}
              onClick={tile.expandable ? () => handleTileClick(tile.id) : undefined}
            />
          </div>
        );
      })}

      {/* Expandable Payment Gateway Sub-nodes */}
      <AnimatePresence>
        {expandedTile === "source-payments" && paymentsTile?.subNodes && (
          paymentsTile.subNodes.map((subNode, subIdx) => {
            const pos = subNodePositionMap[subNode.id] || { x: 170, y: 485 };
            return (
              <motion.div
                key={subNode.id}
                initial={{ opacity: 0, scale: 0.82, y: -8, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.86, y: -6, filter: "blur(6px)" }}
                transition={{
                  duration: 0.55,
                  ease: premiumEase,
                  delay: subIdx * 0.04,
                }}
                className="absolute z-30"
                style={{
                  left: `${(pos.x / 1200) * 100}%`,
                  top: `${(pos.y / 640) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <IntegrationTile item={subNode} index={subIdx + 12} isSubnode={true} />
              </motion.div>
            );
          })
        )}
      </AnimatePresence>

      {/* Expandable CRM Sub-nodes */}
      <AnimatePresence>
        {expandedTile === "source-crm" && crmTile?.subNodes && (
          crmTile.subNodes.map((subNode, subIdx) => {
            const pos = crmBranchPositionMap[subNode.id] || { x: 170, y: 165 };
            return (
              <motion.div
                key={subNode.id}
                initial={{ opacity: 0, scale: 0.82, y: -8, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.86, y: -6, filter: "blur(6px)" }}
                transition={{
                  duration: 0.55,
                  ease: premiumEase,
                  delay: subIdx * 0.04,
                }}
                className="absolute z-30"
                style={{
                  left: `${(pos.x / 1200) * 100}%`,
                  top: `${(pos.y / 640) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <IntegrationTile item={subNode} index={subIdx + 16} isSubnode={true} />
              </motion.div>
            );
          })
        )}
      </AnimatePresence>

      {/* Central processing hub card — centered exactly at y:320 within 1200x640 viewBox */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <IntegrationHubCard />
      </div>

      {/* Output / Destination tiles */}
      {destinations.map((tile, idx) => {
        const pos = nodePositionMap[tile.id] || { x: 1030, y: 100 };
        return (
          <div
            key={tile.id}
            className="absolute"
            style={{
              left: `${(pos.x / 1200) * 100}%`,
              top: `${(pos.y / 640) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <IntegrationTile item={tile} index={idx + 6} />
          </div>
        );
      })}
    </div>
  );
}
