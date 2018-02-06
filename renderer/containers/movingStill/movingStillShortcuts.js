class movingStillShortcuts {
  constructor(undo, redo, deleteSelection) {
    this.undo = undo; // cmd + z
    this.redo = redo; // cmd + shft + z
    this.deleteSelection = deleteSelection;
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
    } else {
      switch (event.keyCode) {
        case 8:
          this.deleteSelection();
          break;
        default:
          return;
      }
    }
  };
}

export default movingStillShortcuts;
