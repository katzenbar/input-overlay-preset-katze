import React from "react";
import { usePressedKeys } from "../hooks/usePressedKeys";

export const KeyboardInput: React.FC = () => {
  const { pressedKeys } = usePressedKeys();

  return (
    <div className="fixed top-0 bottom-16 left-0 right-0 flex justify-center items-end">
      {pressedKeys.size > 0 && (
        <span className="py-3 px-6 rounded-3xl bg-slate-800 text-white">
          <span className="text-3xl font-semibold">{Array.from(pressedKeys).join(" + ")}</span>
        </span>
      )}
    </div>
  );
};
