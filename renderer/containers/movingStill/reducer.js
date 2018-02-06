import { actionTypes } from './actions';
import * as globalStyles from '../../globalStyles';
import * as Actions from './actions';
import * as d3 from 'd3';
import getHistory from '../../lib/getHistory';
import throttleQuality from '../../lib/throttleQuality';
import * as DrawHelpers from '../../lib/drawHelpers';

const initialState = {
  history: {
    undoStack: [],
    redoStack: [],
  },
  imgPath: '',
  isInitialized: false,
  vectorCanvas: {},
  currentTool: '',
  viewMode: 'edit',
  anchors: [],
  vectors: [],
  selection: {},
  boundingRect: {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  },
  previewDimensions: {
    height: 0,
    width: 0,
  },
  renderDimensions: {
    height: 0,
    width: 0,
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
  let lc,
    mask,
    history,
    actionObject,
    anchors,
    anchor,
    vectors,
    vector,
    selection;
  switch (action.type) {
    case actionTypes.SELECT_MOVING_STILL_IMAGE:
      //reset state
      state = initialState;

      // throttle preview to 2k to prevent crashes
      const previewDimensions = throttleQuality(action.naturalDimensions, '2K');
      return {
        ...state,
        imgPath: action.imgPath,
        boundingRect: action.boundingRect,
        previewDimensions,
      };
    case actionTypes.INITIALIZE_MOVING_STILL_CANVAS:
      let vectorCanvas = d3.select('#movingStillSVG');
      return {
        ...state,
        isInitialized: true,
        currentTool: action.tool,
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
      let boundingRect = state.vectorCanvas.node().getBoundingClientRect();
      return {
        ...state,
        viewMode: 'preview',
        boundingRect,
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

      // define the opposite action
      actionObject = {
        action: Actions.removeAnchor,
        arg1: anchor,
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
      anchor = action.anchor;

      actionObject = {
        action: Actions.addAnchor,
        arg1: anchor,
      };

      anchors = DrawHelpers.removeAnchor(anchors, anchor);
      history = getHistory(state.history, action, actionObject);

      return {
        ...state,
        anchors,
        history,
      };
    case actionTypes.ADD_VECTOR:
      vector = action.vector;

      actionObject = {
        action: Actions.removeVector,
        arg1: action.vector,
      };

      vector = DrawHelpers.drawVectorHead(state.vectorCanvas, vector);

      // draw arrow path if not already drawn
      if (action.isRedo || action.isUndo) {
        vector = DrawHelpers.drawVectorPath(state.vectorCanvas, vector);
      }

      vectors = state.vectors;
      vectors.push(vector);

      history = getHistory(state.history, action, actionObject);

      return {
        ...state,
        vectors,
        history,
      };
    case actionTypes.REMOVE_VECTOR:
      vectors = state.vectors;
      vector = action.vector;

      actionObject = {
        action: Actions.addVector,
        arg1: vector,
      };

      vectors = DrawHelpers.removeVector(vectors, vector);
      history = getHistory(state.history, action, actionObject);

      return {
        ...state,
        vectors,
        history,
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
    case actionTypes.SELECT_SELECTION_TOOL:
      return {
        ...state,
        currentTool: 'selector',
      };
    case actionTypes.MAKE_SELECTION:
      selection = {
        anchors: [],
        vectors: [],
      };

      for (anchor of state.anchors) {
        if (DrawHelpers.isBounded(action.corners, anchor)) {
          anchor.component
            .attr('stroke', globalStyles.action)
            .attr('fill', globalStyles.action);
          selection.anchors.push(anchor);
        } else {
          anchor.component
            .attr('stroke', globalStyles.anchorColor)
            .attr('fill', globalStyles.anchorColor);
        }
      }

      for (vector of state.vectors) {
        if (DrawHelpers.isBounded(action.corners, vector[1])) {
          vector[1].path.attr('stroke', globalStyles.action);
          selection.vectors.push(vector);
        } else {
          vector[1].path.attr('stroke', globalStyles.vectorHeadColor);
        }
      }

      return {
        ...state,
        selection,
      };
    case actionTypes.DELETE_SELECTION:
      return {
        ...state,
        selection: null,
      };
    default:
      return state;
  }
};
