import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ children, content, side = "top" }: TooltipProps) {
  const [open, setOpen] = React.useState(false);

  const getTransform = () => {
    switch (side) {
      case "top": return "translateY(-8px)";
      case "bottom": return "translateY(8px)";
      case "left": return "translateX(-8px)";
      case "right": return "translateX(8px)";
      default: return "translateY(-8px)";
    }
  };

  const getPositionClasses = () => {
    switch (side) {
      case "top": return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "bottom": return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left": return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right": return "left-full top-1/2 -translate-y-1/2 ml-2";
      default: return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)", transform: getTransform() }}
            animate={{ opacity: 1, filter: "blur(0px)", transform: "translate(0px, 0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)", transform: getTransform() }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 px-2.5 py-1.5 text-[11px] font-semibold text-white bg-neutral-900 border border-neutral-700 shadow-xl rounded-md whitespace-nowrap pointer-events-none ${getPositionClasses()}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
