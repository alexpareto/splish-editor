export const actionTypes = {
  SELECT_CINEMAGRAPH_VIDEO: 'SELECT_CINEMAGRAPH_VIDEO',
  INITIALIZE_CINEMAGRAPH_CANVAS: 'INITIALIZE_CINEMAGRAPH_CANVAS',
  UNDO_CINEMAGRAPH: 'UNDO_CINEMAGRAPH',
  REDO_CINEMAGRAPH: 'REDO_CINEMAGRAPH',
  UPDATE_CINEMAGRAPH_BRUSH_POINTS: 'UPDATE_CINEMAGRAPH_BRUSH_POINTS',
  UPDATE_CINEMAGRAPH_BRUSH_BLUR: 'UPDATE_CINEMAGRAPH_BRUSH_POINTS',
  START_EXPORTING_CINEMAGRAPH: 'START_EXPORTING_CINEMAGRAPH',
  CINEMAGRAPH_EXPORT_COMPLETE: 'CINEMAGRAPH_EXPORT_COMPLETE',
  CINEMAGRAPH_SHARE_COMPLETE: 'CINEMAGRAPH_SHARE_COMPLETE',
};

export const selectCinemagraphVideo = files => {
  return { type: actionTypes.SELECT_CINEMAGRAPH_VIDEO, files: files };
};

export const startCinemagraphEditMode = () => {
  return { type: actionTypes.START_CINEMAGRAPH_EDIT_MODE };
};

export const renderCinemagraph = path => {
  return { type: actionTypes.RENDER_CINEMAGRAPH, path: path };
};

export const updateCinemagraphBrushPoints = path => {
  return { type: actionTypes.UPDATE_CINEMAGRAPH_BRUSH_POINTS, path: path };
};

export const updateCinemagraphBrushBlur = path => {
  return { type: actionTypes.UPDATE_CINEMAGRAPH_BRUSH_BLUR, path: path };
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
