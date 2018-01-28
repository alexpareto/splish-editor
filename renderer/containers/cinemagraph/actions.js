export const actionTypes = {
  SELECT_CINEMAGRAPH_VIDEO: 'SELECT_CINEMAGRAPH_VIDEO',
  INITIALIZE_CINEMAGRAPH_CANVAS: 'INITIALIZE_CINEMAGRAPH_CANVAS',
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
};

export const selectCinemagraphVideo = files => {
  return { type: actionTypes.SELECT_CINEMAGRAPH_VIDEO, files: files };
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

export const initializeCinemagraphCanvas = () => {
  return { type: actionTypes.INITIALIZE_CINEMAGRAPH_CANVAS };
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
export const addCinemagraphBrushStroke = (isUndo, isRedo, stroke) => {
  return {
    type: actionTypes.ADD_CINEMAGRAPH_BRUSH_STROKE,
    isUndo,
    isRedo,
    stroke,
  };
};

export const removeCinemagraphBrushStroke = (isUndo, isRedo, stroke) => {
  return {
    type: actionTypes.REMOVE_CINEMAGRAPH_BRUSH_STROKE,
    isUndo,
    isRedo,
    stroke,
  };
};

export const startCinemagraphPreview = callback => {
  return { type: actionTypes.START_CINEMAGRAPH_PREVIEW, callback };
};
