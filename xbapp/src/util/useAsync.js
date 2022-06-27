import React from "react";

const useAsync = function ({ initialResult = null, initialLoading = true }) {
  const [state, setState] = React.useState({
    l: initialLoading,
    e: false,
    result: initialResult,
  });

  const act = async function (operation) {
    setState({ result: initialResult, l: true, e: false });

    let result;
    try {
      result = await operation;
    } catch (error) {
      setState({ result: initialResult, l: false, e: true });
      console.log(error);
      return;
    }

    console.log(result);
    setState({ result, l: false, e: false });
  };

  return {
    ...state,
    act,
  };
};

export default useAsync;
