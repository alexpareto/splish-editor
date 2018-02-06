export const actionTypes = {
  SELECT_CINEMAGRAPH_VIDEO: 'SELECT_CINEMAGRAPH_VIDEO',
  UNDO_CINEMAGRAPH: 'UNDO_CINEMAGRAPH',
  REDO_CINEMAGRAPH: 'REDO_CINEMAGRAPH',
  UPDATE_CINEMAGRAPH_BRUSH_SIZE: 'UPDATE_CINEMAGRAPH_BRUSH_SIZE',
  UPDATE_CINEMAGRAPH_BRUSH_BLUR: 'UPDATE_CINEMAGRAPH_BRUSH_POINTS',
  START_EXPORTING_CINEMAGRAPH: 'START_EXPORTING_CINEMAGRAPH',
  CINEMAGRAPH_EXPORT_COMPLETE: 'CINEMAGRAPH_EXPORT_COMPLETE',
  CINEMAGRAPH_SHARE_COMPLETE: 'CINEMAGRAPH_SHARE_COMPLETE',
  ADD_CINEMAGRAPH_BRUSH_STROKE: 'ADD_CINEMAGRAPH_BRUSH_STROKE',
  REMOVE_CINEMAGRAPH_BRUSH_STROKE: 'REMOVE_CINEMAGRAPH_BRUSH_STROKE',
  SELECT_CINEMAGRAPH_ERASE_TOOL: 'SELECT_CINEMAGRAPH_ERASE_TOOL',
  SELECT_CINEMAGRAPH_BRUSH_TOOL: 'SELECT_CINEMAGRAPH_BRUSH_TOOL',
  START_CINEMAGRAPH_PREVIEW: 'START_CINEMAGRAPH_PREVIEW',
  TOGGLE_CINEMAGRAPH_OVERLAY: 'TOGGLE_CINEMAGRAPH_OVERLAY',
  RESET_CINEMAGRAPH_STATE: 'RESET_CINEMAGRAPH_STATE',
  LOAD_THUMBNAILS: 'LOAD_THUMBNAILS',
  CINEMAGRAPH_TRIM_FRONT: 'TRIM_FRONT',
  CINEMAGRAPH_TRIM_BACK: 'TRIM_BACK',
  CINEMAGRAPH_SET_STILL_FRAME: 'CINEMAGRAPH_SET_STILL_FRAME',
};

export const selectCinemagraphVideo = (
  videoPath,
  naturalDimensions,
  boundingRect,
  numThumbnails,
) => {
  return {
    type: actionTypes.SELECT_CINEMAGRAPH_VIDEO,
    videoPath,
    naturalDimensions,
    boundingRect,
    numThumbnails,
  };
};

export const selectCinemagraphBrushTool = () => {
  return { type: actionTypes.SELECT_CINEMAGRAPH_BRUSH_TOOL };
};

export const selectCinemagraphEraseTool = () => {
  return { type: actionTypes.SELECT_CINEMAGRAPH_ERASE_TOOL };
};

export const startCinemagraphEditMode = () => {
  return { type: actionTypes.START_CINEMAGRAPH_EDIT_MODE };
};

export const updateCinemagraphBrushSize = brushSize => {
  return { type: actionTypes.UPDATE_CINEMAGRAPH_BRUSH_SIZE, brushSize };
};

export const updateCinemagraphBrushBlur = brushBlur => {
  return { type: actionTypes.UPDATE_CINEMAGRAPH_BRUSH_BLUR, brushBlur };
};

export const startExportingCinemagraph = () => {
  return { type: actionTypes.START_EXPORTING_CINEMAGRAPH };
};

export const cinemagraphExportComplete = () => {
  return { type: actionTypes.CINEMAGRAPH_EXPORT_COMPLETE };
};

export const cinemagraphShareComplete = () => {
  return { type: actionTypes.CINEMAGRAPH_SHARE_COMPLETE };
};

export const undoCinemagraph = actionObject => {
  return { type: actionTypes.UNDO_CINEMAGRAPH, actionObject };
};

export const redoCinemagraph = actionObject => {
  return { type: actionTypes.REDO_CINEMAGRAPH, actionObject };
};

// brush strokes and erase strokes will use the same action,
// but each brush stroke will specify its brush type
export const addCinemagraphBrushStroke = (isUndo, isRedo, mask) => {
  return {
    type: actionTypes.ADD_CINEMAGRAPH_BRUSH_STROKE,
    isUndo,
    isRedo,
    mask,
  };
};

export const removeCinemagraphBrushStroke = (isUndo, isRedo, mask) => {
  return {
    type: actionTypes.REMOVE_CINEMAGRAPH_BRUSH_STROKE,
    isUndo,
    isRedo,
    mask,
  };
};

export const startCinemagraphPreview = callback => {
  return { type: actionTypes.START_CINEMAGRAPH_PREVIEW, callback };
};

export const toggleCinemagraphOverlay = () => {
  return { type: actionTypes.TOGGLE_CINEMAGRAPH_OVERLAY };
};

export const resetCinemagraphState = () => {
  return { type: actionTypes.RESET_CINEMAGRAPH_STATE };
};

export const loadThumbnails = () => {
  return { type: actionTypes.LOAD_THUMBNAILS };
};

export const cinemagraphTrimFront = time => {
  return { type: actionTypes.CINEMAGRAPH_TRIM_FRONT, time };
};

export const cinemagraphTrimBack = time => {
  return { type: actionTypes.CINEMAGRAPH_TRIM_BACK, time };
};

export const cinemagraphSetStillFrame = time => {
  return { type: actionTypes.CINEMAGRAPH, time };
};
