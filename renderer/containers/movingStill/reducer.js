import { actionTypes } from './actions';
import { dispatch } from 'redux';
import * as globalStyles from '../../globalStyles';
import * as Actions from './actions';
import * as d3 from 'd3';
import getHistory from '../../lib/getHistory';
import throttleQuality from '../../lib/throttleQuality';
import * as DrawHelpers from '../../lib/drawHelpers';
import Preview from '../../webgl/helpers/previewMovingStill';

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
  file: null,
  preview: null,
  orientation: 1,
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
    selection,
    preview;
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
        orientation: action.orientation,
        previewDimensions,
      };
    case actionTypes.INITIALIZE_MOVING_STILL_CANVAS:
      let vectorCanvas = d3.select('#movingStillSVG');

      preview = new Preview(
        state.imgPath,
        state.anchors,
        state.vectors,
        state.boundingRect,
        state.animationParams,
        state.duration,
        action.callback,
        state.orientation,
      );

      return {
        ...state,
        currentTool: 'vector',
        vectorCanvas,
        preview,
      };
    case actionTypes.SELECT_VECTOR_TOOL:
      DrawHelpers.clearSelection(state.anchors, state.vectors);
      selection = {
        anchors: [],
        vectors: [],
      };
      return {
        ...state,
        selection,
        currentTool: 'vector',
      };
    case actionTypes.SELECT_ANCHOR_TOOL:
      DrawHelpers.clearSelection(state.anchors, state.vectors);
      selection = {
        anchors: [],
        vectors: [],
      };
      return {
        ...state,
        selection,
        currentTool: 'anchor',
      };
    case actionTypes.START_MOVING_STILL_PREVIEW_MODE:
      setTimeout(() => {
        state.preview.update(state.anchors, state.vectors, state.duration);
      }, 50);
      return {
        ...state,
        viewMode: 'preview',
      };
    case actionTypes.START_MOVING_STILL_EDIT_MODE:
      state.preview.stop();
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
      anchor = DrawHelpers.drawAnchor(state.vectorCanvas, action.anchor);

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
      state.preview.stop();
      setTimeout(() => {
        state.preview.update(state.anchors, state.vectors, state.duration);
        state.preview.capture();
      }, 200);
      return {
        ...state,
        isRendering: true,
        viewMode: 'edit',
        showExportModal: true,
      };
    case actionTypes.MOVING_STILL_EXPORT_COMPLETE:
      return {
        ...state,
        file: action.file,
        isRendering: false,
      };
    case actionTypes.MOVING_STILL_SHARE_COMPLETE:
      return {
        ...state,
        showExportModal: false,
      };
    case actionTypes.UPDATE_MOVING_STILL_DURATION:
      if (state.viewMode == 'preview') {
        setTimeout(() => {
          state.preview.update(state.anchors, state.vectors, action.duration);
        }, 40);
      }
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
      vectors = state.vectors;
      anchors = state.anchors;

      if (action.isUndo || action.isRedo) {
        selection = action.selection;
      } else {
        selection = state.selection;
      }

      if (!selection.vectors && !selection.anchors) {
        return state;
      }

      for (vector of selection.vectors) {
        vectors = DrawHelpers.removeVector(vectors, vector);
      }

      for (anchor of selection.anchors) {
        anchors = DrawHelpers.removeAnchor(anchors, anchor);
      }

      actionObject = {
        action: Actions.addSelection,
        arg1: selection,
      };

      history = getHistory(state.history, action, actionObject);

      if (!action.isUndo && !action.isRedo) {
        selection = { anchors: [], vectors: [] };
      }

      return {
        ...state,
        history,
        vectors,
        anchors,
        selection,
      };
    case actionTypes.ADD_SELECTION:
      selection = action.selection;
      anchors = state.anchors;
      vectors = state.vectors;
      let nSelection = {
        anchors: [],
        vectors: [],
      };

      for (vector of selection.vectors) {
        vector = DrawHelpers.drawVectorPath(state.vectorCanvas, vector);
        vector = DrawHelpers.drawVectorHead(state.vectorCanvas, vector);
        vectors.push(vector);
        nSelection.vectors.push(vector);
      }

      for (anchor of selection.anchors) {
        anchor = DrawHelpers.drawAnchor(state.vectorCanvas, anchor);
        anchors.push(anchor);
        nSelection.anchors.push(anchor);
      }

      actionObject = {
        action: Actions.deleteSelection,
        arg1: nSelection,
      };

      history = getHistory(state.history, action, actionObject);

      return {
        ...state,
        history,
        anchors,
        vectors,
      };
    case actionTypes.RESET_MOVING_STILL_STATE:
      return initialState;
    default:
      return state;
  }
};
