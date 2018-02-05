export const actionTypes = {
  INITIALIZE_MOVING_STILL_CANVAS: 'INITIALIZE_MOVING_STILL_CANVAS',
  SELECT_MOVING_STILL_IMAGE: 'SELECT_MOVING_STILL_IMAGE',
  UNDO_MOVING_STILL: 'UNDO_MOVING_STILL',
  REDO_MOVING_STILL: 'REDO_MOVING_STILL',
  START_MOVING_STILL_PREVIEW_MODE: 'START_MOVING_STILL_PREVIEW_MODE',
  START_MOVING_STILL_EDIT_MODE: 'START_MOVING_STILL_EDIT_MODE',
  SELECT_VECTOR_TOOL: 'SELECT_VECTOR_TOOL',
  SELECT_ANCHOR_TOOL: 'SELECT_ANCHOR_TOOL',
  SELECT_SELECTION_TOOL: 'SELECT_SELECTION_TOOL',
  RENDER_MOVING_STILL: 'RENDER_MOVING_STILL',
  ADD_ANCHOR: 'ADD_ANCHOR',
  ADD_VECTOR: 'ADD_VECTOR',
  UPDATE_ANIMATION_PARAMS: 'UPDATE_ANIMATION_PARAMS',
  START_EXPORTING_MOVING_STILL: 'START_EXPORTING_MOVING_STILL',
  MOVING_STILL_EXPORT_COMPLETE: 'MOVING_STILL_EXPORT_COMPLETE',
  MOVING_STILL_SHARE_COMPLETE: 'MOVING_STILL_SHARE_COMPLETE',
  UPDATE_MOVING_STILL_DURATION: 'UPDATE_MOVING_STILL_DURATION',
  REMOVE_ANCHOR: 'REMOVE_ANCHOR',
  REMOVE_VECTOR: 'REMOVE_VECTOR',
  MAKE_SELECTION: 'MAKE_SELECTION',
  DELETE_SELECTION: 'DELETE_SELECTION',
};

// ACTIONS
export const initializeMovingStillCanvas = tool => {
  return { type: actionTypes.INITIALIZE_MOVING_STILL_CANVAS, tool };
};

export const selectMovingStillImage = (
  imgPath,
  naturalDimensions,
  boundingRect,
) => {
  return {
    type: actionTypes.SELECT_MOVING_STILL_IMAGE,
    imgPath,
    naturalDimensions,
    boundingRect,
  };
};

export const startMovingStillEditMode = () => {
  return { type: actionTypes.START_MOVING_STILL_EDIT_MODE };
};

export const startMovingStillPreviewMode = () => {
  return { type: actionTypes.START_MOVING_STILL_PREVIEW_MODE };
};

export const renderMovingStill = path => {
  return { type: actionTypes.RENDER_MOVING_STILL, path };
};

export const selectAnchorTool = () => {
  return { type: actionTypes.SELECT_ANCHOR_TOOL };
};

export const selectVectorTool = () => {
  return { type: actionTypes.SELECT_VECTOR_TOOL };
};

export const addAnchor = (isUndo, isRedo, anchor) => {
  return { type: actionTypes.ADD_ANCHOR, anchor, isUndo, isRedo };
};

export const addVector = (isUndo, isRedo, vector) => {
  return { type: actionTypes.ADD_VECTOR, vector, isUndo, isRedo };
};

export const updateAnimationParams = params => {
  return { type: actionTypes.UPDATE_ANIMATION_PARAMS, params };
};

export const startExportingMovingStill = () => {
  return { type: actionTypes.START_EXPORTING_MOVING_STILL };
};

export const movingStillExportComplete = () => {
  return { type: actionTypes.MOVING_STILL_EXPORT_COMPLETE };
};

export const movingStillShareComplete = () => {
  return { type: actionTypes.MOVING_STILL_SHARE_COMPLETE };
};

export const updateMovingStillDuration = duration => {
  return { type: actionTypes.UPDATE_MOVING_STILL_DURATION, duration };
};

export const undoMovingStill = actionObject => {
  return { type: actionTypes.UNDO_MOVING_STILL, actionObject };
};

export const redoMovingStill = actionObject => {
  return { type: actionTypes.REDO_MOVING_STILL, actionObject };
};

export const removeAnchor = (isUndo, isRedo, anchor) => {
  return { type: actionTypes.REMOVE_ANCHOR, anchor, isUndo, isRedo };
};

export const removeVector = (isUndo, isRedo, vector) => {
  return { type: actionTypes.REMOVE_VECTOR, vector, isUndo, isRedo };
};

export const makeSelection = corners => {
  return { type: actionTypes.MAKE_SELECTION, corners };
};

export const deleteSelection = () => {
  return { type: actionTypes.DELETE_SELECTION };
};

export const selectSelectionTool = () => {
  return { type: actionTypes.SELECT_SELECTION_TOOL };
};
