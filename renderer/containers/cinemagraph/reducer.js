import { actionTypes } from './actions';
import * as globalStyles from '../../globalStyles';
import Preview from '../../webgl/helpers/renderCinemagraph';
import getHistory from '../../lib/getHistory';
import * as Actions from './actions';

const initialState = {
  history: {
    undoStack: [],
    redoStack: [],
  },
  videoPath: '',
  boundingRect: {},
  brushBlur: 5,
  brushSize: 50,
  videoDimensions: {
    width: 0,
    height: 0,
  },
  showOverlay: false,
  showExportModal: false,
  isRendering: false,
  tool: 'eraser',
};

export const cinemagraphReducer = (state = initialState, action) => {
  let preview, history, actionObject, prevMask, nextMask, tool;
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
    case actionTypes.START_CINEMAGRAPH_PREVIEW:
      preview = new Preview(state.boundingRect, action.callback);
      return {
        ...state,
        preview,
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
    case actionTypes.ADD_CINEMAGRAPH_BRUSH_STROKE:
      prevMask = action.mask;
      preview = state.preview;

      // perform the drawing
      if (action.isUndo || action.isRedo) {
        nextMask = action.mask;
        prevMask = preview.getMask();
        preview.setMask(nextMask);
      }

      actionObject = {
        action: Actions.removeCinemagraphBrushStroke,
        arg1: prevMask,
      };

      history = getHistory(state.history, action, actionObject);

      return {
        ...state,
        history,
      };
    case actionTypes.REMOVE_CINEMAGRAPH_BRUSH_STROKE:
      nextMask = action.mask;
      preview = state.preview;

      actionObject = {
        action: Actions.addCinemagraphBrushStroke,
        arg1: preview.getMask(),
      };

      preview.setMask(nextMask);

      history = getHistory(state.history, action, actionObject);

      return {
        ...state,
        history,
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
    case actionTypes.SELECT_CINEMAGRAPH_BRUSH_TOOL:
      return {
        ...state,
        tool: 'brush',
      };
    case actionTypes.SELECT_CINEMAGRAPH_ERASE_TOOL:
      return {
        ...state,
        tool: 'eraser',
      };
    case actionTypes.TOGGLE_CINEMAGRAPH_OVERLAY:
      const showOverlay = !state.showOverlay;
      state.preview.setShowOverlay(showOverlay);
      return {
        ...state,
        showOverlay,
      };
    default:
      return state;
  }
};
