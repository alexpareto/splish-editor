import { actionTypes } from './actions';
import * as globalStyles from '../../globalStyles';
import Preview from '../../webgl/helpers/renderCinemagraph';
import getHistory from '../../lib/getHistory';
import throttleQuality from '../../lib/throttleQuality';
import * as Actions from './actions';

const initialState = {
  history: {
    undoStack: [],
    redoStack: [],
  },
  videoPath: '',
  brushBlur: 5,
  brushSize: 50,
  boundingRect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  previewDimensions: {
    width: 0,
    height: 0,
  },
  renderDimensions: {
    width: 0,
    height: 0,
  },
  file: null,
  showOverlay: false,
  showExportModal: false,
  isRendering: false,
  tool: 'eraser',
  thumbnailsLoaded: false,
  numThumbnails: 0,
  videoStartTime: 0,
  videoEndTime: 10,
  isSeeking: false,
  duration: 0,
};

export const cinemagraphReducer = (state = initialState, action) => {
  let preview, history, actionObject, prevMask, nextMask, tool;
  switch (action.type) {
    case actionTypes.SELECT_CINEMAGRAPH_VIDEO:
      //reset state
      state = initialState;

      const previewDimensions = throttleQuality(action.naturalDimensions, '2K');
      return {
        ...state,
        boundingRect: action.boundingRect,
        videoPath: action.videoPath,
        previewDimensions,
        videoEndTime: action.duration,
        duration: action.duration,
      };
    case actionTypes.START_CINEMAGRAPH_PREVIEW:
      preview = new Preview(
        state.boundingRect,
        action.callback,
        state.previewDimensions,
      );
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
      state.preview.setShowOverlay(false);
      return {
        ...state,
        showOverlay: false,
        isRendering: true,
        showExportModal: true,
      };
    case actionTypes.CINEMAGRAPH_EXPORT_COMPLETE:
      return {
        ...state,
        file: action.file,
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
    case actionTypes.RESET_CINEMAGRAPH_STATE:
      state.preview.stop();
      return initialState;
    case actionTypes.LOAD_THUMBNAILS:
      return {
        ...state,
        thumbnailsLoaded: true,
      };
    case actionTypes.CINEMAGRAPH_TRIM_FRONT:
      state.preview.setSeeking(false);
      state.preview.updateTrim(action.time, state.videoEndTime);
      return {
        ...state,
        duration: state.videoEndTime - action.time,
        videoStartTime: action.time,
      };
    case actionTypes.CINEMAGRAPH_TRIM_BACK:
      state.preview.setSeeking(false);
      state.preview.updateTrim(state.videoStartTime, action.time);
      return {
        ...state,
        duration: action.time - state.videoStartTime,
        videoEndTime: action.time,
        isSeeking: false,
      };
    case actionTypes.CINEMAGRAPH_SET_STILL_FRAME:
      state.preview.setStillFrame();

      // todo is implement undo/redo for this
      history = {
        redoStack: [],
        undoStack: [],
      };

      return {
        ...state,
        history,
      };
    case actionTypes.CINEMAGRAPH_START_SEEKING:
      state.preview.setSeeking(true);
      return {
        ...state,
        isSeeking: true,
      };
    default:
      return state;
  }
};
