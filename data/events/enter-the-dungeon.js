TileEvent.build('enter-the-dungeon', {

  stages:[{
    pages: [
      { text:`You go into the dungeon` },
    ]
  }],

  // Wipe tile board, place dungeon core tile, reset tile bag with starting tiles
  onServerFinish: state => {
    GameState.clear();
    GameBuilder.beginDefaultGame();
    DungeonController.renderDungeon();
  },

});
