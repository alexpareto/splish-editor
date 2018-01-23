import { actionTypes } from './actions';
import * as globalStyles from '../../globalStyles';

const initialState = {
  undoStack: [],
  redoStack: [],
  videoPath: '',
  boundingRect: {},
  brushPoints: [],
  brushBlur: 0,
  videoDimensions: {
    width: 0,
    height: 0,
  },
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
    case actionTypes.UPDATE_CINEMAGRAPH_BRUSH_POINTS:
      return {
        ...state,
      };
    case actionTypes.UPDATE_CINEMAGRAPH_BRUSH_BLUR:
      return {
        ...state,
      };
    case actionTypes.RENDER_CINEMAGRAPH:
      return {
        ...state,
        renderPath,
      };
    default:
      return state;
  }
};
