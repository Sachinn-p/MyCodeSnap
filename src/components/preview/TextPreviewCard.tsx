import { useState, useRef, useEffect } from "react";
import { useCanvasStore } from "../../stores/useCanvasStore";
import type { CanvasNode } from "../../types/canvas";

interface Props {
  node: CanvasNode;
}

export default function TextPreviewCard({ node }: Props) {
  const { updateNode, selectedNodeId } = useCanvasStore();
  const text = node.data?.text || "";
  const fontSize = node.data?.fontSize || 32;
  const color = node.data?.color || "#ffffff";
  const fontWeight = node.data?.fontWeight || "bold";
  
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);

  const saveText = () => {
    if (editableRef.current) {
      updateNode(node.id, {
        data: { ...node.data, text: editableRef.current.innerText || "" }
      });
    }
  };

  // If node gets deselected, save and exit edit mode
  useEffect(() => {
    if (selectedNodeId !== node.id && isEditing) {
      saveText();
      setIsEditing(false);
    }
  }, [selectedNodeId, node.id, isEditing]);

  useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editableRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    } else if (!isEditing && editableRef.current) {
      // Sync DOM text if it changed externally while not editing
      if (editableRef.current.innerText !== text) {
        editableRef.current.innerText = text;
      }
    }
  }, [isEditing, text]);

  return (
    <div 
      ref={editableRef}
      className={`p-4 outline-none whitespace-pre-wrap transition-colors ${isEditing ? "bg-white/10 ring-2 ring-indigo-500 rounded-md cursor-text" : "cursor-default"}`}
      style={{
        width: node.width ? `${node.width}px` : undefined,
        height: node.height ? `${node.height}px` : undefined,
        fontSize: `${fontSize}px`,
        color,
        fontWeight,
        fontFamily: node.data?.fontFamily || "inherit",
        textAlign: node.data?.textAlign || "left",
        textShadow: "0 4px 12px rgba(0,0,0,0.5)",
        minWidth: "100px",
        wordWrap: "break-word",
      }}
      onDoubleClick={() => setIsEditing(true)}
      onPointerDown={(e) => {
        if (isEditing) {
          e.stopPropagation(); // Allow cursor placement without dragging
        }
      }}
      contentEditable={isEditing}
      suppressContentEditableWarning
      data-drag-handle
      onBlur={() => {
        setIsEditing(false);
        saveText();
      }}
    >
      {text}
    </div>
  );
}
