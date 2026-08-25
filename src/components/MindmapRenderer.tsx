"use client";

import { useEffect, useRef, useState } from "react";
import { Network, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export type MindmapNode = { id: string; label: string; meta?: { page?: number } };
export type MindmapEdge = { from: string; to: string; label?: string };

export type MindmapData = {
  title?: string;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
};

interface MindmapRendererProps {
  mindmap: MindmapData;
}

export default function MindmapRenderer({ mindmap }: MindmapRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const svgId = useRef(`mindmap-${Math.random().toString(36).slice(2, 9)}`);

  function jsonToMermaid(m: MindmapData) {
    const lines: string[] = [];
    lines.push("graph TD");
    
    // Style configurations for Mermaid theme
    lines.push("  classDef default fill:#E0E5EC,stroke:#6C63FF,stroke-width:2px,color:#3D4852,font-family:inherit,font-weight:600,rx:12px,ry:12px;");
    lines.push("  classDef root fill:#6C63FF,stroke:#5A52E0,stroke-width:2px,color:#FFFFFF,font-family:inherit,font-weight:800,rx:16px,ry:16px;");

    const nodeIds = new Set<string>();

    (m.nodes || []).forEach((n, index) => {
      nodeIds.add(n.id);
      const safeLabel = (n.label || "")
        .replace(/["`]/g, "'")
        .replace(/[<>{}]/g, "")
        .replace(/\n/g, " ")
        .trim();
      const pageInfo = n.meta?.page ? ` (p.${n.meta.page})` : "";
      lines.push(`  ${n.id}["${safeLabel}${pageInfo}"]`);
      if (index === 0) {
        lines.push(`  class ${n.id} root;`);
      }
    });

    (m.edges || []).forEach((e) => {
      if (nodeIds.has(e.from) && nodeIds.has(e.to)) {
        const rawLabel = e.label ? e.label.replace(/["`]/g, "'").replace(/[<>{}]/g, "").trim() : "";
        const label = rawLabel ? `|"${rawLabel}"|` : "";
        lines.push(`  ${e.from} -->${label} ${e.to}`);
      }
    });

    return lines.join("\n");
  }

  useEffect(() => {
    let mounted = true;
    async function render() {
      setRenderError(null);
      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;
        if (!mounted) return;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
          themeVariables: {
            primaryColor: "#6C63FF",
            primaryTextColor: "#FFFFFF",
            primaryBorderColor: "#5A52E0",
            lineColor: "#6C63FF",
            secondaryColor: "#38B2AC",
            tertiaryColor: "#E0E5EC",
            textColor: "#3D4852",
            mainBkg: "#E0E5EC",
            nodeBorder: "#6C63FF",
            clusterBkg: "#E0E5EC",
            fontSize: "14px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
        });

        const definition = jsonToMermaid(mindmap);
        const { svg } = await mermaid.render(svgId.current, definition);

        if (mounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
          // make the generated svg responsive
          const svgElement = containerRef.current.querySelector("svg");
          if (svgElement) {
            svgElement.style.width = "100%";
            svgElement.style.height = "auto";
            svgElement.style.maxWidth = "100%";
          }
        }
      } catch (e) {
        console.error("Mermaid render error:", e);
        if (mounted) {
          setRenderError(e instanceof Error ? e.message : "Failed to render diagram.");
        }
      }
    }

    render();
    return () => {
      mounted = false;
    };
  }, [mindmap]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#A3B1C6]/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="neu-inset-sm flex h-8 w-8 items-center justify-center rounded-xl text-[#6C63FF]">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-[#3D4852]">
              {mindmap.title || "Concept Mind Map"}
            </h4>
            <p className="text-[11px] font-medium text-[#6B7280]">
              {mindmap.nodes?.length || 0} nodes • {mindmap.edges?.length || 0} connections
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            className="neu-icon-btn h-8 w-8 rounded-xl text-xs"
            title="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[42px] text-center font-mono text-xs font-bold text-[#6B7280]">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="neu-icon-btn h-8 w-8 rounded-xl text-xs"
            title="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="neu-icon-btn h-8 w-8 rounded-xl text-xs"
            title="Reset zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {renderError ? (
        <div className="neu-inset-sm rounded-2xl p-6 text-center text-sm font-medium text-[#E53E3E]">
          Failed to render diagram visual: {renderError}
        </div>
      ) : (
        <div className="neu-inset-deep overflow-auto rounded-2xl p-6 max-h-[600px] flex items-center justify-center">
          <div
            ref={containerRef}
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center", transition: "transform 0.2s ease" }}
            className="w-full flex items-center justify-center min-h-[250px]"
          />
        </div>
      )}
    </div>
  );
}
