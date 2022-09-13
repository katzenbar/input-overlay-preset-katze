import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMouseDownState } from "../hooks/useMouseDownState";
import { useMousePosition } from "../hooks/useMousePosition";

const size = 30;

export const MouseClickHighlight: React.FC = () => {
  const mouseDownState = useMouseDownState();
  const mousePosition = useMousePosition();

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        transform: `translate(${mousePosition.x - 0.5 * size}px, ${mousePosition.y - 0.5 * size}px)`,
      }}
    >
      <AnimatePresence>
        {mouseDownState[0] && (
          <motion.div
            key="demo"
            className="border-4 border-red-500"
            style={{
              height: size,
              width: size,
              borderRadius: "100%",
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }}
            transition={{ type: "spring", duration: 0.15, bounce: 0.3 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          ></motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
