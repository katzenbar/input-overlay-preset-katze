import React from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useMouseDownState } from "../hooks/useMouseDownState";
import { useMousePosition } from "../hooks/useMousePosition";

const mouseHighlightRadius = 15;
const indicatorRatio = 0.4;

const transition = { type: "spring", duration: 0.15, bounce: 0.3 };

export const MouseClickHighlight: React.FC = () => {
  const mouseDownState = useMouseDownState();
  const mousePosition = useMousePosition();

  const anyMouseButtonDown = mouseDownState[1] || mouseDownState[2] || mouseDownState[3];

  const indicatorRadius = indicatorRatio * mouseHighlightRadius;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
      }}
    >
      <MotionConfig transition={transition}>
        <AnimatePresence>
          {mouseDownState[1] && (
            <motion.div
              key="lmb-highlight"
              className="rounded-full	bg-red-500"
              style={{
                position: "absolute",
                height: 2 * indicatorRadius,
                width: 2 * indicatorRadius,
                top: -indicatorRadius,
                right: mouseHighlightRadius + 1.4 * indicatorRadius,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            />
          )}

          {mouseDownState[2] && (
            <>
              <motion.div
                key="rmb-highlight-1"
                className="rounded-full	bg-red-500"
                style={{
                  position: "absolute",
                  height: 2 * indicatorRadius,
                  width: 2 * indicatorRadius,
                  top: -2.4 * indicatorRadius,
                  left: mouseHighlightRadius + 1.4 * indicatorRadius,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              />
              <motion.div
                key="rmb-highlight-2"
                className="rounded-full	bg-red-500"
                style={{
                  position: "absolute",
                  height: 2 * indicatorRadius,
                  width: 2 * indicatorRadius,
                  top: 0.4 * indicatorRadius,
                  left: mouseHighlightRadius + 1.4 * indicatorRadius,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              />
            </>
          )}

          {mouseDownState[3] && (
            <motion.div
              key="mmb-highlight"
              className="rounded-full	bg-red-500"
              style={{
                position: "absolute",
                height: 3 * indicatorRadius,
                width: 2 * indicatorRadius,
                bottom: mouseHighlightRadius + 1.4 * indicatorRadius,
                right: -indicatorRadius,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            />
          )}

          {anyMouseButtonDown && (
            <motion.div
              key="mouse-highlight"
              className="rounded-full	border-4 border-red-500"
              style={{
                position: "absolute",
                top: -mouseHighlightRadius,
                left: -mouseHighlightRadius,
                height: 2 * mouseHighlightRadius,
                width: 2 * mouseHighlightRadius,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            />
          )}
        </AnimatePresence>
      </MotionConfig>
    </motion.div>
  );
};
