global.WorldState = (function() {

  const $stateRecorder = new StateRecorder(`${DATA}/worldState.json`);

  let $currentState;

  // Resetting the world state removes all of the game progression. This is
  // called when the specs are started in order to baseline the world state,
  // but would very rarely if ever be called in production.
  async function reset() {
    $currentState = { options: {
      keyBindings: WorldState.DefaultBindings,
    }};

    await WorldState.saveState();

    GameState.clear();
    await GameState.saveState();
  }

  function getCurrentState() { return { ...$currentState }; }
  function setOptions(options) { $currentState.options = options; }

  function saveState() { $stateRecorder.saveState($currentState); }
  function loadState() {
    $stateRecorder.loadState().then(state => {
      if (state == null) { return reset(); }
      $currentState = state;
    });
  }

  return {
    reset,
    getCurrentState,
    setOptions,
    saveState,
    loadState,
  }

})();

WorldState.DefaultBindings = [
  { name:'Move Down',          action:'action.move-down',          codes:[ _keyCodeS, _keyCodeArrowDown ]},
  { name:'Move Up',            action:'action.move-up',            codes:[ _keyCodeW, _keyCodeArrowUp ]},
  { name:'Move Left',          action:'action.move-left',          codes:[ _keyCodeA, _keyCodeArrowLeft ]},
  { name:'Move Right',         action:'action.move-right',         codes:[ _keyCodeD, _keyCodeArrowRight ]},
  { name:'Rotate Clockwise',   action:'action.rotate-clockwise',   codes:[ _keyCodeE ]},
  { name:'Rotate Widdershins', action:'action.rotate-widdershins', codes:[ _keyCodeQ ]},
  { name:'Pause',              action:'action.pause',              codes:[ _keyCodeSpace ]},
]
