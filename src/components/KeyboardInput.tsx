import React, { ReactNode } from "react";
import { sortBy } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindows } from "@fortawesome/free-brands-svg-icons";

import { usePressedKeys } from "../hooks/usePressedKeys";
import { AnimatePresence, motion } from "framer-motion";
import { useConfiguration } from "../hooks/useConfiguration";

const SYMBOL_KEY_LABELS: Record<string, ReactNode | undefined> = {
  VC_MINUS: "-",
  VC_EQUALS: "=",
  VC_OPEN_BRACKET: "[",
  VC_CLOSE_BRACKET: "]",
  VC_BACK_SLASH: "\\",
  VC_SEMICOLON: ";",
  VC_QUOTE: "'",
  VC_COMMA: ",",
  VC_PERIOD: ".",
  VC_SLASH: "/",
  VC_ESCAPE: "Esc",
  VC_TAB: "Tab",
  VC_SPACE: "Space",
  VC_ENTER: "Enter",
  VC_CONTROL_L: "Ctrl",
  VC_CONTROL_R: "Ctrl",
  VC_ALT_L: "Alt",
  VC_ALT_R: "Alt",
  VC_META_L: <FontAwesomeIcon icon={faWindows} />,
  VC_META_R: <FontAwesomeIcon icon={faWindows} />,
  VC_SHIFT_L: "Shift",
  VC_SHIFT_R: "Shift",
};

const SORT_ORDER: Record<string, number | undefined> = {
  VC_CONTROL_L: 1,
  VC_CONTROL_R: 1,
  VC_SHIFT_L: 2,
  VC_SHIFT_R: 2,
  VC_ALT_L: 3,
  VC_ALT_R: 3,
  VC_META_L: 4,
  VC_META_R: 4,
  VC_ESCAPE: 5,
  VC_TAB: 6,
};

const keyCodeToComponent = (keyCode: string) => {
  if (/^VC_[A-Z0-9]$|^VC_F\d$/.test(keyCode)) {
    return keyCode.replace("VC_", "");
  }
  return SYMBOL_KEY_LABELS[keyCode];
};

const sortKeys = (pressedKeys: Set<string>): Array<string> => {
  return sortBy(Array.from(pressedKeys), [(keyCode) => SORT_ORDER[keyCode], (keyCode) => keyCode]);
};

export const KeyboardInput: React.FC = () => {
  const { configuration } = useConfiguration();
  const { pressedKeys, keyCurrentlyPressed } = usePressedKeys();

  const animate =
    pressedKeys.size > 0
      ? keyCurrentlyPressed
        ? { scale: configuration.key_input_down_scale, backgroundColor: configuration.key_input_down_bg }
        : { scale: 1, backgroundColor: configuration.key_input_bg }
      : { scale: 0 };

  const keyCodes = sortKeys(pressedKeys);

  return configuration.key_input_show ? (
    <motion.div className="fixed bottom-16 left-0 right-0 flex justify-center items-end">
      <AnimatePresence>
        {pressedKeys.size > 0 && (
          <motion.span
            className="py-3 px-6 rounded-3xl"
            custom={keyCurrentlyPressed}
            animate={animate}
            transition={{
              type: "spring",
              duration: configuration.key_input_animation_duration,
              bounce: configuration.key_input_animation_bounce,
            }}
            style={{
              color: configuration.key_input_color,
              borderColor: configuration.key_input_outline,
              borderWidth: configuration.key_input_outline_width,
            }}
          >
            <motion.span className="text-3xl font-semibold">
              {keyCodes.map((keyCode, index) => (
                <React.Fragment key={keyCode}>
                  {keyCodeToComponent(keyCode)}
                  {index !== pressedKeys.size - 1 && " + "}
                </React.Fragment>
              ))}
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  ) : null;
};
