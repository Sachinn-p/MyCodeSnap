import { useRef } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import type { AppState } from "../../types";

interface Props {
  state: AppState;
  boundsRef: React.RefObject<HTMLDivElement | null>;
}

export default function DraggableCode({ state, boundsRef }: Props) {
  const dragRef = useRef<HTMLDivElement>(null);

  if (!state.qrEnabled) return null;

  return (
    <motion.div
      ref={dragRef}
      drag
      dragConstraints={boundsRef}
      dragMomentum={false}
      dragElastic={0}
      initial={{ x: 50, y: 50 }}
      className="absolute cursor-grab active:cursor-grabbing shadow-2xl z-20 group"
      style={{
        width: state.qrSize,
        height: state.qrSize,
        borderRadius: state.qrBorderRadius,
        overflow: "hidden",
        backgroundColor: "white",
        padding: state.qrType === "linkedin" ? state.qrSize * 0.08 : 0,
      }}
    >
      <div className="w-full h-full relative flex items-center justify-center">
        {state.qrType === "linkedin" ? (
          <QRCode
            value={state.qrUrl}
            size={state.qrSize * 0.84}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 256 256`}
            level="H"
          />
        ) : (
          state.snapcodeImage ? (
            <img 
              src={state.snapcodeImage} 
              alt="Snapcode" 
              className="w-full h-full object-contain pointer-events-none"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-yellow-400 text-black text-[10px] font-bold text-center leading-tight">
              <span>Upload</span>
              <span>Snapcode</span>
            </div>
          )
        )}
      </div>

      {/* Resize handle hint - visible only on hover */}
      <div className="absolute inset-0 border-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ borderRadius: "inherit" }} />
    </motion.div>
  );
}
