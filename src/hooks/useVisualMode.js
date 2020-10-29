const { useState } = require("react");

export const useVisualMode = function(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {

    setHistory(current => {
      if (replace) {
        current.pop();
      }
      return [...current, mode]
    });
    setMode(mode);
  }

  function back() {
    if (history.length > 1) {
      history.pop();
      setMode(history[history.length-1]);
    }
  }

  return { mode, transition, back };

}