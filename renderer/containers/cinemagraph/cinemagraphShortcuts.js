class cinemagraphShortcuts {
  constructor(undo, redo) {
    this.undo = undo; // cmd + z
    this.redo = redo; // cmd + shft + z
  }

  // logic for the key strokes goes here!
  keyStroke = (event, state) => {
    const key = String.fromCharCode(event.keyCode);
    let length;

    // Case 1: command + shift + key
    // Case 2: command + key
    if (event.metaKey && event.shiftKey) {
      switch (key) {
        case 'Z':
          length = state.history.redoStack.length;
          if (length) {
            this.redo(state.history.redoStack[length - 1]);
          } else {
            console.log('NOTHING TO REDO');
          }
          return;
        default:
          return;
      }
    } else if (event.metaKey) {
      switch (key) {
        case 'Z':
          length = state.history.undoStack.length;
          if (length) {
            this.undo(state.history.undoStack[length - 1]);
          } else {
            console.log('NOTHING TO UNDO');
          }
          return;
        default:
          return;
      }
    }
  };
}

export default cinemagraphShortcuts;
