import React from "react";

const useIdxBelt = function (maxIdx, initialIdx) {
  const [currentIdx, setCurrentIdx] = React.useState(initialIdx);

  const createChangeIdxHandler = function (dir) {
    return () => {
      const newIdx = currentIdx + dir;
      if (newIdx < 0 || newIdx > maxIdx) {
        return;
      }

      setCurrentIdx(newIdx);
    };
  };

  return {
    idx: currentIdx,
    set: setCurrentIdx,
    prev: createChangeIdxHandler(-1),
    next: createChangeIdxHandler(1),
  };
};

export default useIdxBelt;
