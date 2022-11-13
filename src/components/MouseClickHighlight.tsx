import React from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useMouseDownState } from "../hooks/useMouseDownState";
import { useMousePosition } from "../hooks/useMousePosition";
import { useConfiguration } from "../hooks/useConfiguration";

export const MouseClickHighlight: React.FC = () => {
  const { configuration } = useConfiguration();
  const mouseDownState = useMouseDownState();
  const mousePosition = useMousePosition();

  const anyMouseButtonDown = mouseDownState[1] || mouseDownState[2] || mouseDownState[3];

  const transition = {
    type: "spring",
    duration: configuration.mouse_click_animation_duration,
    bounce: configuration.mouse_click_animation_bounce,
  };

  const mouseHighlightRadius = configuration.mouse_click_highlight_radius;
  const highlightColor = configuration.mouse_click_highlight_color;
  const highlightWidth = configuration.mouse_click_highlight_width;

  const outlineColor = configuration.mouse_click_highlight_outline;
  const outlineWidth = configuration.mouse_click_highlight_outline_width;

  const indicatorRatio = configuration.mouse_click_indicator_size_ratio;
  const middleIndicatorRatio = configuration.mouse_click_indicator_mmb_size_ratio;
  const buttonIndicatorRadius = indicatorRatio * mouseHighlightRadius;
  const indicatorSpacing = configuration.mouse_click_indicator_spacing;

  const buttonIndicatorOuterRadius = buttonIndicatorRadius + outlineWidth;
  const mouseHighlightOuterRadius = mouseHighlightRadius + highlightWidth / 2 + outlineWidth;

  const indicatorCircle = (
    <motion.circle
      cx={buttonIndicatorOuterRadius}
      cy={buttonIndicatorOuterRadius}
      r={buttonIndicatorRadius}
      fill={highlightColor}
      stroke={outlineColor}
      strokeWidth={outlineWidth}
    />
  );

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
            <motion.svg
              viewBox={`0 0 ${2 * buttonIndicatorOuterRadius} ${2 * buttonIndicatorOuterRadius}`}
              key="lmb-highlight"
              style={{
                position: "absolute",
                height: 2 * buttonIndicatorOuterRadius,
                width: 2 * buttonIndicatorOuterRadius,
                top: -buttonIndicatorOuterRadius,
                right: mouseHighlightRadius + indicatorSpacing * buttonIndicatorOuterRadius,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              {indicatorCircle}
            </motion.svg>
          )}

          {mouseDownState[2] && (
            <>
              <motion.svg
                viewBox={`0 0 ${2 * buttonIndicatorOuterRadius} ${2 * buttonIndicatorOuterRadius}`}
                key="rmb-highlight-1"
                style={{
                  position: "absolute",
                  height: 2 * buttonIndicatorOuterRadius,
                  width: 2 * buttonIndicatorOuterRadius,
                  bottom: indicatorSpacing / 2,
                  left: mouseHighlightRadius + indicatorSpacing * buttonIndicatorOuterRadius,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                {indicatorCircle}
              </motion.svg>
              <motion.svg
                viewBox={`0 0 ${2 * buttonIndicatorOuterRadius} ${2 * buttonIndicatorOuterRadius}`}
                key="rmb-highlight-2"
                style={{
                  position: "absolute",
                  height: 2 * buttonIndicatorOuterRadius,
                  width: 2 * buttonIndicatorOuterRadius,
                  top: indicatorSpacing / 2,
                  left: mouseHighlightRadius + indicatorSpacing * buttonIndicatorOuterRadius,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                {indicatorCircle}
              </motion.svg>
            </>
          )}

          {mouseDownState[3] && (
            <motion.svg
              viewBox={`0 0 ${2 * buttonIndicatorOuterRadius} ${
                middleIndicatorRatio * buttonIndicatorRadius + 2 * outlineWidth
              }`}
              key="mmb-highlight"
              style={{
                position: "absolute",
                width: 2 * buttonIndicatorOuterRadius,
                height: 3 * buttonIndicatorOuterRadius,
                bottom: mouseHighlightRadius + indicatorSpacing * buttonIndicatorOuterRadius,
                right: -buttonIndicatorOuterRadius,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <motion.rect
                x={outlineWidth}
                y={outlineWidth}
                rx={buttonIndicatorRadius}
                width={2 * buttonIndicatorRadius}
                height={middleIndicatorRatio * buttonIndicatorRadius}
                fill={highlightColor}
                stroke={outlineColor}
                strokeWidth={outlineWidth}
              />
            </motion.svg>
          )}

          {anyMouseButtonDown && (
            <motion.svg
              viewBox={`0 0 ${mouseHighlightOuterRadius * 2} ${mouseHighlightOuterRadius * 2}`}
              key="mouse-highlight"
              style={{
                position: "absolute",
                top: -mouseHighlightOuterRadius,
                left: -mouseHighlightOuterRadius,
                height: 2 * mouseHighlightOuterRadius,
                width: 2 * mouseHighlightOuterRadius,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <motion.circle
                cx={mouseHighlightOuterRadius}
                cy={mouseHighlightOuterRadius}
                r={mouseHighlightRadius}
                fill="none"
                stroke={outlineColor}
                strokeWidth={highlightWidth + 2 * outlineWidth}
              />
              <motion.circle
                cx={mouseHighlightOuterRadius}
                cy={mouseHighlightOuterRadius}
                r={mouseHighlightRadius}
                fill="none"
                stroke={highlightColor}
                strokeWidth={highlightWidth}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </MotionConfig>
    </motion.div>
  );
};
