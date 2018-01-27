class cinemagraphShortcuts {
  constructor(undo, redo) {
    this.undo = undo; // cmd + z
    this.redo = redo; // cmd + shft + z
  }

  // logic for the key strokes goes here!
  keyStroke = (event, state) => {
    console.log('KEY STROKE');
  };
}

export default cinemagraphShortcuts;
