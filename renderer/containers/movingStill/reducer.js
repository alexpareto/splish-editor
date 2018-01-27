import { actionTypes } from './actions';
import * as globalStyles from '../../globalStyles';
import * as Actions from './actions';
import * as d3 from 'd3';
import getHistory from '../../lib/getHistory';

const initialState = {
  history: {
    undoStack: [],
    redoStack: [],
  },
  imgPath: '',
  isInitialized: false,
  vectorCanvas: {},
  imageHeight: 0,
  imgDimensions: {
    height: 0,
    width: 0,
  },
  currentTool: '',
  viewMode: 'edit',
  anchors: [],
  vectors: [],
  boundingRect: {
    width: 0,
    height: 0,
  },
  animationParams: {
    dragDistance: 4.0,
    anchorImpact: 2.5,
    impactDivisor: 4.0,
  },
  showExportModal: false,
  isRendering: false,
  shareLink: '',
  duration: 3.0,
};

export const movingStillReducer = (state = initialState, action) => {
  let lc, mask, history, actionObject, anchors, anchor;
  switch (action.type) {
    case actionTypes.SELECT_MOVING_STILL_IMAGE:
      const imgPath = 'file://' + action.files[0];
      return {
        ...state,
        imgPath,
      };
    case actionTypes.INITIALIZE_MOVING_STILL_CANVAS:
      const img = document.getElementById('movingStillImage');

      const imageHeight = img.clientHeight;

      const naturalWidth =
        img.naturalWidth % 2 == 0 ? img.naturalWidth : img.naturalWidth + 1;

      const naturalHeight =
        img.naturalHeight % 2 == 0 ? img.naturalHeight : img.naturalHeight + 1;

      let vectorCanvas = d3.select('#movingStillSVG');
      let boundingRect = vectorCanvas.node().getBoundingClientRect();

      return {
        ...state,
        imageHeight,
        imgDimensions: {
          height: naturalHeight,
          width: naturalWidth,
        },
        isInitialized: true,
        currentTool: action.tool,
        boundingRect,
        vectorCanvas,
      };
    case actionTypes.SELECT_VECTOR_TOOL:
      return {
        ...state,
        currentTool: 'vector',
      };
    case actionTypes.SELECT_ANCHOR_TOOL:
      return {
        ...state,
        currentTool: 'anchor',
      };
    case actionTypes.START_MOVING_STILL_PREVIEW_MODE:
      return {
        ...state,
        viewMode: 'preview',
      };
    case actionTypes.START_MOVING_STILL_EDIT_MODE:
      return {
        ...state,
        viewMode: 'edit',
      };
    case actionTypes.RENDER_MOVING_STILL:
      const renderPath = 'file://' + action.path;
      return {
        ...state,
      };
    case actionTypes.ADD_ANCHOR:
      anchors = state.anchors;
      let circle = state.vectorCanvas.append('circle');
      circle
        .attr('cx', action.anchor.x)
        .attr('cy', action.anchor.y)
        .attr('r', 3);

      anchor = {
        x: action.anchor.x,
        y: action.anchor.y,
        component: circle,
      };

      actionObject = {
        undo: {
          action: Actions.removeAnchor,
          arg1: anchor,
        },
        redo: {
          action: Actions.addAnchor,
          arg1: anchor,
        },
      };

      anchors.push(anchor);
      history = getHistory(state.history, action, actionObject);

      return {
        ...state,
        anchors,
        history,
      };
    case actionTypes.REMOVE_ANCHOR:
      anchors = state.anchors;
      let removeIndex = state.anchors.length - 1;
      anchor = action.anchor;

      for (let i = state.anchors.length - 1; i >= 0; i--) {
        if (anchors[i].x == anchor.x && anchors[i].y == anchor.y) {
          removeIndex = i;
          break;
        }
      }

      actionObject = {
        undo: {
          action: Actions.addAnchor,
          arg1: anchor,
        },
        redo: {
          action: Actions.removeAnchor,
          arg1: anchor,
        },
      };

      anchors.splice(removeIndex, 1);
      console.log('COMPONENT: ', anchor.component);
      history = getHistory(history, action, actionObject);

      return {
        ...state,
        anchors,
        history,
      };
    case actionTypes.ADD_VECTOR:
      let vectors = state.vectors;
      vectors.push(action.vector);
      return {
        ...state,
        vectors,
      };
    case actionTypes.UPDATE_ANIMATION_PARAMS:
      let animationParams = action.params;
      return {
        ...state,
        animationParams,
      };
    case actionTypes.START_EXPORTING_MOVING_STILL:
      return {
        ...state,
        isRendering: true,
        viewMode: 'edit',
        showExportModal: true,
      };
    case actionTypes.MOVING_STILL_EXPORT_COMPLETE:
      return {
        ...state,
        isRendering: false,
      };
    case actionTypes.MOVING_STILL_SHARE_COMPLETE:
      return {
        ...state,
        showExportModal: false,
      };
    case actionTypes.UPDATE_MOVING_STILL_DURATION:
      return {
        ...state,
        duration: action.duration,
      };
    default:
      return state;
  }
};
