import React from "react";

const useCarousel = function (maxIdx, initialIdx) {
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

  React.useEffect(() => {
    setCurrentIdx(initialIdx);
  }, [initialIdx]);

  return [
    currentIdx,
    createChangeIdxHandler(-1),
    createChangeIdxHandler(1),
    setCurrentIdx,
  ];
};

export default useCarousel;
