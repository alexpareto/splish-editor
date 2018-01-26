import { actionTypes } from './actions';
import * as globalStyles from '../../globalStyles';

const initialState = {
  undoStack: [],
  redoStack: [],
  videoPath: '',
  boundingRect: {},
  brushPoints: [],
  brushBlur: 5,
  brushSize: 50,
  videoDimensions: {
    width: 0,
    height: 0,
  },
  showExportModal: false,
  isRendering: false,
};

export const cinemagraphReducer = (state = initialState, action) => {
  let lc, mask;
  switch (action.type) {
    case actionTypes.SELECT_CINEMAGRAPH_VIDEO:
      const videoPath = 'file://' + action.files[0];
      return {
        ...state,
        videoPath,
      };
    case actionTypes.INITIALIZE_CINEMAGRAPH_CANVAS:
      const vid = document.getElementById('cinemagraphVideo');
      const clientWidth = vid.clientWidth;
      const clientHeight = vid.clientHeight;
      const naturalWidth = vid.videoWidth;
      const naturalHeight = vid.videoHeight;
      return {
        ...state,
        boundingRect: {
          width: clientWidth,
          height: clientHeight,
        },
        videoDimensions: {
          width: naturalWidth,
          height: naturalHeight,
        },
      };
    case actionTypes.UPDATE_CINEMAGRAPH_BRUSH_SIZE:
      return {
        ...state,
        brushSize: action.brushSize,
      };
    case actionTypes.UPDATE_CINEMAGRAPH_BRUSH_BLUR:
      return {
        ...state,
        brushBlur: action.brushBlur,
      };
    case actionTypes.START_EXPORTING_CINEMAGRAPH:
      return {
        ...state,
        isRendering: true,
        showExportModal: true,
      };
    case actionTypes.CINEMAGRAPH_EXPORT_COMPLETE:
      return {
        ...state,
        isRendering: false,
      };
    case actionTypes.CINEMAGRAPH_SHARE_COMPLETE:
      return {
        ...state,
        showExportModal: false,
      };
    default:
      return state;
  }
};
