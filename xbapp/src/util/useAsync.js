import React from "react";

const useAsync = function (initialLoading = true) {
  const [state, setState] = React.useState({
    l: initialLoading,
    e: false,
    result: null,
  });

  const act = async function (operation) {
    setState({ result: null, l: true, e: false });

    let result;
    try {
      result = await operation;
    } catch (error) {
      setState({ result: null, l: false, e: true });
      console.log(error);
      return;
    }

    setState({ result, l: false, e: false });
  };

  return {
    ...state,
    act,
  };
};

export default useAsync;
