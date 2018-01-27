// this bit of logic is going to need to be
// in all reducers that affect undo/redo stack
export default (history, action, actionObject) => {
  if (action.isUndo) {
    history.undoStack.pop();
    history.redoStack.push(actionObject);
  } else {
    history.undoStack.push(actionObject);
    // check for redo
    if (action.isRedo) {
      history.redoStack.pop();
    } else {
      history.redoStack = [];
    }
  }

  return history;
};
