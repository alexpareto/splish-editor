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
  brushStrokes: [],
  brushBlur: 5,
  brushSize: 50,
  videoDimensions: {
    width: 0,
    height: 0,
  },
  showExportModal: false,
  isRendering: false,
  tool: 'eraser',
  strokeID: 0,
};

export const cinemagraphReducer = (state = initialState, action) => {
  let preview, history, actionObject, stroke, brushStrokes, strokeID, tool;
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
      stroke = action.stroke;
      strokeID = state.strokeID;
      stroke.id = strokeID;
      strokeID++;
      preview = state.preview;
      brushStrokes = state.brushStrokes;

      brushStrokes.push(stroke);

      actionObject = {
        action: Actions.removeCinemagraphBrushStroke,
        arg1: stroke,
      };

      history = getHistory(state.history, action, actionObject);

      // draw the brush stroke
      if (action.isUndo || action.isRedo) {
        for (let i = 0; i < stroke.points.length; i++) {
          preview.update(
            stroke.points[i],
            stroke.brushSize,
            stroke.brushBlur,
            stroke.tool,
          );
        }
      }

      return {
        ...state,
        brushStrokes,
        history,
        strokeID,
      };
    case actionTypes.REMOVE_CINEMAGRAPH_BRUSH_STROKE:
      stroke = action.stroke;
      brushStrokes = state.brushStrokes;

      //get opposite tool of the stroke
      tool = stroke.tool == 'erasor' ? 'brush' : 'erasor';
      preview = state.preview;

      // remove stroke from list of brushStrokes
      for (let i = 0; i < brushStrokes.length; i++) {
        if (stroke.id == brushStrokes[i].id) {
          brushStrokes.splice(i, 1);
          break;
        }
      }

      // draw the opposite of the stroke on the canvas
      for (let i = 0; i < stroke.points.length; i++) {
        preview.update(stroke.points[i], stroke.size, stroke.blur, tool);
      }

      return {
        ...state,
        brushStrokes,
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
