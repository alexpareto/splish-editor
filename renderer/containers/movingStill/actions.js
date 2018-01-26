export const actionTypes = {
  INITIALIZE_MOVING_STILL_CANVAS: 'INITIALIZE_MOVING_STILL_CANVAS',
  SELECT_MOVING_STILL_IMAGE: 'SELECT_MOVING_STILL_IMAGE',
  UNDO_MOVING_STILL: 'UNDO_MOVING_STILL',
  REDO_MOVING_STILL: 'REDO_MOVING_STILL',
  START_MOVING_STILL_PREVIEW_MODE: 'START_MOVING_STILL_PREVIEW_MODE',
  START_MOVING_STILL_EDIT_MODE: 'START_MOVING_STILL_EDIT_MODE',
  SELECT_VECTOR_TOOL: 'SELECT_VECTOR_TOOL',
  SELECT_ANCHOR_TOOL: 'SELECT_ANCHOR_TOOL',
  RENDER_MOVING_STILL: 'RENDER_MOVING_STILL',
  ADD_ANCHOR: 'ADD_ANCHOR',
  ADD_VECTOR: 'ADD_VECTOR',
  UPDATE_ANIMATION_PARAMS: 'UPDATE_ANIMATION_PARAMS',
  START_EXPORTING_MOVING_STILL: 'START_EXPORTING_MOVING_STILL',
  MOVING_STILL_EXPORT_COMPLETE: 'MOVING_STILL_EXPORT_COMPLETE',
  MOVING_STILL_SHARE_COMPLETE: 'MOVING_STILL_SHARE_COMPLETE',
  UPDATE_MOVING_STILL_DURATION: 'UPDATE_MOVING_STILL_DURATION',
};

// ACTIONS
export const initializeMovingStillCanvas = tool => {
  return { type: actionTypes.INITIALIZE_MOVING_STILL_CANVAS, tool };
};

export const selectMovingStillImage = files => {
  return { type: actionTypes.SELECT_MOVING_STILL_IMAGE, files };
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

export const addAnchor = anchor => {
  return { type: actionTypes.ADD_ANCHOR, anchor };
};

export const addVector = vector => {
  return { type: actionTypes.ADD_VECTOR, vector };
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
