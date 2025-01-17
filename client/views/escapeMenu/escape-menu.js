window.EscapeMenu = (function() {

  // TODO: Allow remapping of keys.
  const EscapeKey = 27;
  const F5 = 116;
  const F9 = 120;

  function init() {
    X.onCodeDown(EscapeKey, canSave, toggleMenu);
    X.onCodeDown(F5, canSave, quickSave);
    X.onCodeDown(F9, canLoad, quickLoad);

    X.onClick('#escapeMenu .button', hideMenu);
    X.onClick('#escapeMenu .options-button', OptionsOverlay.show);
    X.onClick('#escapeMenu .save-button', quickSave);
    X.onClick('#escapeMenu .quit-button', confirmQuit);
  }

  function canSave() {
    if (Renderer.getCurrentWorld() == null) { return false; }
    if (X.hasClass('#optionsOverlay','hide') === false) { return false; }
    if (X.hasClass('#escapeMenu','hide') === false) { return true; }
    if (X.hasClass('#mapCanvas','hide') === false) { return true; }

    let content = X.first("#mainContent > div");
    if (content == null) {
      return false;
    }

    // Visibility based on id of element inside of main content.
    return ['eventView'].includes(content.getAttribute('id'));
  }

  // We cannot quick load when on the main menu or on the new game page because
  // there's no valid game to load.
  function canLoad() {
    if (Renderer.getCurrentWorld() == null) { return false; }

    let content = X.first("#mainContent > div");
    if (content) {
      return !['mainMenu','newGame'].includes(content.getAttribute('id'));
    }
    return true;
  }

  function toggleMenu() {
    if (X.hasClass("#escapeMenu",'hide')) {
      X.removeClass('#escapeCover','hide');
      X.removeClass('#escapeMenu','hide');
    } else {
      X.addClass('#escapeCover','hide');
      X.addClass('#escapeMenu','hide');
    }
  }

  function hideMenu() {
    X.addClass('#escapeCover','hide');
    X.addClass('#escapeMenu','hide');
  }

  function isOpen() {
    return X.hasClass('#escapeMenu','hide') === false;
  }

  function confirmQuit() {
    Confirmation.show({
      text: `Quit to Main Menu? <br> Unsaved progress will be lost.`,
      onConfirm: () => {
        ClientCommands.send('game.quit');
        MainContent.reset();
        MainMenu.show();
      }
    });
  }

  function quickSave() {
    if (X.first('.save-game-alert') != null) { return; }

    ClientCommands.send('game.save').then(result => {
      if (result === 'success') {
        new Alert({
          message: 'Game Saved',
          position: 'side',
          classname: 'save-game-alert success'
        }).display();
      }
    });
  }

  function quickLoad() {
    if (X.first('.save-game-alert') != null) { return; }

    MainContent.reset();
    ClientCommands.send('game.load',Renderer.getCurrentWorld()).then(result => {
      new Alert({
        message: 'Game Loaded',
        position: 'side',
        classname: 'save-game-alert success'
      }).display();
    });
  }

  return {
    init,
    isOpen,
  };

})();
