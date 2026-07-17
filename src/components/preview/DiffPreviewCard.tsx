import { forwardRef } from "react";
import type { CanvasNode } from "../../types/canvas";
import { createTwoFilesPatch } from "diff";
import * as Diff2Html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";

interface Props {
  node: CanvasNode;
}

const DiffPreviewCard = forwardRef<HTMLDivElement, Props>(({ node }, ref) => {
  const data = node.data;
  const originalCode = data.originalCode || "const before = true;";
  const modifiedCode = data.modifiedCode || "const after = true;";
  const theme = data.theme === "github-light" ? "light" : "vs-dark";
  const renderSideBySide = data.renderSideBySide ?? false;
  const windowStyle = data.windowStyle || "mac";
  const borderRadius = data.borderRadius ?? 12;
  const dropShadow = data.dropShadow ?? true;
  const fontSize = data.fontSize || 14;

  const patch = createTwoFilesPatch('Original', 'Modified', originalCode, modifiedCode, '', '', { context: 3 });
  
  const diffHtml = Diff2Html.html(patch, {
    drawFileList: false,
    matching: 'none',
    outputFormat: renderSideBySide ? 'side-by-side' : 'line-by-line',
    renderNothingWhenEmpty: false,
  });

  return (
    <div
      ref={ref}
      className="relative transition-all duration-300 w-full h-full"
      style={{
        width: node.width ? `${node.width}px` : `700px`,
        height: node.height ? `${node.height}px` : undefined,
        filter: dropShadow ? 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.5))' : 'none',
      }}
    >
      <div 
        className="w-full h-full border overflow-hidden flex flex-col shadow-2xl"
        style={{ 
          borderRadius,
          backgroundColor: theme === "light" ? "#ffffff" : "#0d1117",
          borderColor: theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"
        }}
      >
        {/* Window Controls */}
        {windowStyle !== 'none' && (
          <div 
            data-drag-handle
            className={`h-12 shrink-0 px-4 flex items-center border-b cursor-grab active:cursor-grabbing ${windowStyle === 'windows' ? 'justify-end' : 'justify-start'}`}
            style={{ 
              backgroundColor: theme === "light" ? "#f6f8fa" : "#161b22",
              borderColor: theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"
            }}
          >
            {windowStyle === 'mac' && (
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
            )}
            {windowStyle === 'linux' && (
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-neutral-600" />
                <div className="w-3 h-3 rounded-full bg-neutral-600" />
                <div className="w-3 h-3 rounded-full bg-neutral-600" />
              </div>
            )}
            {windowStyle === 'windows' && (
              <div className="flex gap-4 items-center">
                <div className="w-3 h-[1px]" style={{ backgroundColor: theme === "light" ? "#24292f" : "#8b949e" }} />
                <div className="w-3 h-3 border" style={{ borderColor: theme === "light" ? "#24292f" : "#8b949e" }} />
                <div className="w-3 h-3 relative before:absolute before:inset-0 before:w-full before:h-[1px] before:rotate-45 before:top-1/2 after:absolute after:inset-0 after:w-full after:h-[1px] after:-rotate-45 after:top-1/2" style={{ '--tw-before-bg': theme === "light" ? "#24292f" : "#8b949e", '--tw-after-bg': theme === "light" ? "#24292f" : "#8b949e" } as any} />
              </div>
            )}
          </div>
        )}
        
        {/* diff2html container */}
        <div 
          className={`w-full flex-1 min-h-0 overflow-auto github-diff-wrapper ${theme}`} 
          style={{ fontSize: `${fontSize}px` }}
        >
          <div dangerouslySetInnerHTML={{ __html: diffHtml }} />
        </div>
      </div>

      <style>{`
        .github-diff-wrapper .d2h-wrapper {
          text-align: left;
        }
        .github-diff-wrapper .d2h-file-header {
          display: none;
        }
        .github-diff-wrapper .d2h-file-wrapper {
          border: none;
          border-radius: 0;
          margin-bottom: 0;
        }
        .github-diff-wrapper.vs-dark .d2h-file-wrapper {
          background-color: #0d1117;
        }
        .github-diff-wrapper.vs-dark .d2h-file-wrapper,
        .github-diff-wrapper.vs-dark .d2h-diff-table,
        .github-diff-wrapper.vs-dark .d2h-code-line, 
        .github-diff-wrapper.vs-dark .d2h-code-line-ctn,
        .github-diff-wrapper.vs-dark .d2h-code-line-prefix {
          color: #e6edf3 !important;
        }
        
        .github-diff-wrapper.light .d2h-file-wrapper,
        .github-diff-wrapper.light .d2h-diff-table,
        .github-diff-wrapper.light .d2h-code-line, 
        .github-diff-wrapper.light .d2h-code-line-ctn,
        .github-diff-wrapper.light .d2h-code-line-prefix {
          color: #1F2328 !important;
        }
        
        /* Dark Theme GitHub Colors */
        .github-diff-wrapper.vs-dark .d2h-ins {
          background-color: rgba(46, 160, 67, 0.15);
          border-color: rgba(46, 160, 67, 0.4);
        }
        .github-diff-wrapper.vs-dark .d2h-del {
          background-color: rgba(248, 81, 73, 0.15);
          border-color: rgba(248, 81, 73, 0.4);
        }
        .github-diff-wrapper .d2h-code-line ins,
        .github-diff-wrapper .d2h-code-line del,
        .github-diff-wrapper .d2h-code-side-line ins,
        .github-diff-wrapper .d2h-code-side-line del {
          background-color: transparent !important;
          text-decoration: none !important;
        }
        
        .github-diff-wrapper.vs-dark .d2h-emptyplaceholder,
        .github-diff-wrapper.vs-dark .d2h-code-side-emptyplaceholder {
          background-color: #010409 !important;
          border-color: #30363d !important;
        }

        .github-diff-wrapper.light .d2h-emptyplaceholder,
        .github-diff-wrapper.light .d2h-code-side-emptyplaceholder {
          background-color: #f6f8fa !important;
          border-color: rgba(0,0,0,0.1) !important;
        }

        .github-diff-wrapper .d2h-info {
          display: none !important;
        }
        
        /* Line Numbers */
        .github-diff-wrapper.vs-dark .d2h-code-linenumber {
          background-color: #0d1117;
          border-color: #30363d;
          color: #6e7681 !important;
        }
        .github-diff-wrapper.vs-dark .d2h-code-side-linenumber {
          background-color: #0d1117;
          color: #6e7681;
          border-right: 1px solid #30363d;
        }
        
        .github-diff-wrapper.vs-dark .d2h-ins .d2h-code-linenumber,
        .github-diff-wrapper.vs-dark .d2h-ins .d2h-code-side-linenumber {
          background-color: rgba(46, 160, 67, 0.15);
        }
        
        .github-diff-wrapper.vs-dark .d2h-del .d2h-code-linenumber,
        .github-diff-wrapper.vs-dark .d2h-del .d2h-code-side-linenumber {
          background-color: rgba(248, 81, 73, 0.15);
        }

        /* Tweak typography */
        .github-diff-wrapper table.d2h-diff-table {
          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
          font-size: ${fontSize}px !important;
        }

        /* Hide ugly scrollbars in diff2html side-by-side mode */
        .github-diff-wrapper ::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .github-diff-wrapper, .github-diff-wrapper * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
});

DiffPreviewCard.displayName = "DiffPreviewCard";

export default DiffPreviewCard;
