"use client";

import { useEffect, useRef, useState } from "react";
import { Network, ZoomIn, ZoomOut, RotateCcw, ListTree, Share2, Check, Download } from "lucide-react";

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
  const [viewMode, setViewMode] = useState<"diagram" | "cards">("diagram");
  const [copied, setCopied] = useState(false);

  function jsonToMermaid(m: MindmapData) {
    const lines: string[] = [];
    lines.push("flowchart TD");
    lines.push(
      "  classDef default fill:#E0E5EC,stroke:#6C63FF,stroke-width:2px,color:#3D4852,font-family:inherit,font-weight:600,rx:12px,ry:12px;"
    );
    lines.push(
      "  classDef root fill:#6C63FF,stroke:#5851E0,stroke-width:2px,color:#FFFFFF,font-family:inherit,font-weight:800,rx:16px,ry:16px;"
    );

    const idMap = new Map<string, string>();
    const nodes = m.nodes || [];

    if (nodes.length === 0) {
      nodes.push({ id: "n1", label: m.title || "Document Overview" });
    }

    nodes.forEach((n, index) => {
      const safeId = `node_${index}`;
      
      // Map all variations of the node identifier
      if (n.id) {
        idMap.set(String(n.id), safeId);
        idMap.set(String(n.id).toLowerCase(), safeId);
        idMap.set(String(n.id).trim(), safeId);
      }
      idMap.set(String(index + 1), safeId);
      idMap.set(String(index), safeId);
      if (n.label) {
        idMap.set(n.label.trim().toLowerCase(), safeId);
      }

      // Sanitize label safely
      const cleanLabel = (n.label || `Concept ${index + 1}`)
        .replace(/["`#;<>\\{}[\]()|:]/g, " ")
        .replace(/\s+/g, " ")
        .trim() || `Concept ${index + 1}`;

      const pageInfo = n.meta?.page ? ` p${n.meta.page}` : "";
      lines.push(`  ${safeId}["${cleanLabel}${pageInfo}"]`);

      if (index === 0) {
        lines.push(`  class ${safeId} root;`);
      }
    });

    const edgeLines: string[] = [];
    const edgeSet = new Set<string>();

    (m.edges || []).forEach((e) => {
      const fromId =
        idMap.get(String(e.from)) ||
        idMap.get(String(e.from).toLowerCase()) ||
        idMap.get(String(e.from).trim());
      const toId =
        idMap.get(String(e.to)) ||
        idMap.get(String(e.to).toLowerCase()) ||
        idMap.get(String(e.to).trim());

      if (fromId && toId && fromId !== toId) {
        const edgeKey = `${fromId}->${toId}`;
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          const rawLabel = (e.label || "")
            .replace(/["`#;<>\\{}[\]()|:]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

          if (rawLabel) {
            edgeLines.push(`  ${fromId} -->|${rawLabel}| ${toId}`);
          } else {
            edgeLines.push(`  ${fromId} --> ${toId}`);
          }
        }
      }
    });

    // Auto-connect isolated nodes to root if no edges exist
    if (edgeLines.length === 0 && nodes.length > 1) {
      for (let i = 1; i < nodes.length; i++) {
        edgeLines.push(`  node_0 --> node_${i}`);
      }
    }

    lines.push(...edgeLines);
    return lines.join("\n");
  }

  useEffect(() => {
    let mounted = true;
    async function render() {
      if (!mindmap || !mindmap.nodes || mindmap.nodes.length === 0) return;
      setRenderError(null);

      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;
        if (!mounted) return;

        const uniqueId = "mm_" + Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(0, 8);

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
          themeVariables: {
            primaryColor: "#6C63FF",
            primaryTextColor: "#FFFFFF",
            primaryBorderColor: "#5851E0",
            lineColor: "#6C63FF",
            secondaryColor: "#38B2AC",
            tertiaryColor: "#E0E5EC",
            textColor: "#3D4852",
            mainBkg: "#E0E5EC",
            nodeBorder: "#6C63FF",
            clusterBkg: "#E0E5EC",
            fontSize: "14px",
            fontFamily: "DM Sans, sans-serif",
          },
        });

        const definition = jsonToMermaid(mindmap);
        const { svg } = await mermaid.render(uniqueId, definition);

        if (mounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgElement = containerRef.current.querySelector("svg");
          if (svgElement) {
            svgElement.style.width = "100%";
            svgElement.style.height = "auto";
            svgElement.style.maxHeight = "550px";
            svgElement.style.overflow = "visible";
          }
        }
      } catch (e) {
        console.error("Mermaid diagram rendering note:", e);
        if (mounted) {
          setRenderError(e instanceof Error ? e.message : "Diagram format issue");
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

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(mindmap, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector("svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(mindmap.title || "mindmap").replace(/\s+/g, "_")}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#A3B1C6]/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="neu-inset-sm flex h-9 w-9 items-center justify-center rounded-xl text-[#6C63FF]">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-[#3D4852]">
              {mindmap.title || "Concept Mind Map"}
            </h4>
            <p className="text-[11px] font-medium text-[#6B7280]">
              {mindmap.nodes?.length || 0} concepts • {mindmap.edges?.length || 0} relationships
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <div className="neu-inset-sm flex items-center p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("diagram")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                viewMode === "diagram" ? "neu-btn-primary !min-h-0 !py-1 !px-2.5" : "text-[#6B7280] hover:text-[#3D4852]"
              }`}
            >
              Diagram
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                viewMode === "cards" ? "neu-btn-primary !min-h-0 !py-1 !px-2.5" : "text-[#6B7280] hover:text-[#3D4852]"
              }`}
            >
              Cards
            </button>
          </div>

          {viewMode === "diagram" && !renderError && (
            <>
              <button
                type="button"
                onClick={handleZoomOut}
                className="neu-icon-btn h-8 w-8 rounded-xl text-xs"
                title="Zoom out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[38px] text-center font-mono text-xs font-bold text-[#6B7280]">
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
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="neu-icon-btn h-8 w-8 rounded-xl text-xs"
                title="Download SVG"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleCopyJson}
            className="neu-icon-btn h-8 w-8 rounded-xl text-xs"
            title="Copy mindmap JSON"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[#38B2AC]" /> : <Share2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      {viewMode === "diagram" ? (
        renderError ? (
          <div className="neu-inset-deep rounded-2xl p-6 text-center space-y-4">
            <p className="text-sm font-semibold text-[#6B7280]">
              Switching to structured card view for optimal clarity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {mindmap.nodes.map((node, i) => (
                <div key={node.id || i} className="neu-extruded-sm p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="neu-inset-sm h-6 w-6 rounded-lg text-xs font-bold flex items-center justify-center text-[#6C63FF]">
                      {i + 1}
                    </span>
                    <span className="font-display font-bold text-sm text-[#3D4852]">{node.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="neu-inset-deep overflow-auto rounded-2xl p-6 min-h-[380px] max-h-[600px] flex items-center justify-center vault-scrollbar">
            <div
              ref={containerRef}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center center",
                transition: "transform 0.2s ease",
              }}
              className="w-full flex items-center justify-center min-h-[300px]"
            />
          </div>
        )
      ) : (
        /* Structured Card View */
        <div className="neu-inset-deep rounded-2xl p-6 max-h-[600px] overflow-y-auto vault-scrollbar space-y-4">
          <div className="neu-extruded-sm p-5 rounded-2xl border-l-4 border-[#6C63FF]">
            <div className="flex items-center gap-2.5">
              <span className="neu-btn-primary !min-h-0 !p-1.5 !rounded-xl text-xs font-bold">Root</span>
              <h3 className="font-display text-base font-extrabold text-[#3D4852]">
                {mindmap.nodes[0]?.label || mindmap.title || "Core Topic"}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {mindmap.nodes.slice(1).map((node, idx) => {
              const connectedEdges = (mindmap.edges || []).filter(
                (e) => e.to === node.id || e.from === node.id
              );
              return (
                <div key={node.id || idx} className="neu-extruded-sm p-4 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="neu-inset-sm flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-[#6C63FF]">
                      {idx + 2}
                    </div>
                    <div>
                      <h5 className="font-display text-sm font-bold text-[#3D4852]">{node.label}</h5>
                      {node.meta?.page && (
                        <span className="text-[11px] font-medium text-[#6B7280]">Page {node.meta.page}</span>
                      )}
                    </div>
                  </div>
                  {connectedEdges.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-[#A3B1C6]/20 flex flex-wrap gap-1.5">
                      {connectedEdges.map((e, ei) => (
                        <span
                          key={ei}
                          className="neu-inset-sm px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#38B2AC]"
                        >
                          {e.label || "connected"}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
