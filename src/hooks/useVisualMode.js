const { useState } = require("react");

const useVisualMode = function(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    setMode(mode);
    if (replace) {
      history[history.length-1] = history[history.length-2];
    }
    history.push(mode);
    setHistory(history);
  }

  function back() {

    if (history.length > 1) {
      history.pop();
      setMode(history[history.length-1]);
    }
  }

  return { mode, transition, back };

}

module.exports = { useVisualMode };