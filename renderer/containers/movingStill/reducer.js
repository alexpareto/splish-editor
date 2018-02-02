import { actionTypes } from './actions';
import * as globalStyles from '../../globalStyles';
import * as Actions from './actions';
import * as d3 from 'd3';
import getHistory from '../../lib/getHistory';
import throttleQuality from '../../lib/throttleQuality';

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
    removeIndex;
  switch (action.type) {
    case actionTypes.SELECT_MOVING_STILL_IMAGE:
      // throttle preview to 2k to prevent crashes
      const previewDimensions = throttleQuality(action.naturalDimensions, '2K');
      return {
        ...state,
        imgPath: action.imgPath,
        boundingRect: action.boundingRect,
        previewDimensions: action.naturalDimensions,
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
      removeIndex = state.anchors.length - 1;
      anchor = action.anchor;

      for (let i = state.anchors.length - 1; i >= 0; i--) {
        if (anchors[i].x == anchor.x && anchors[i].y == anchor.y) {
          removeIndex = i;
          break;
        }
      }

      actionObject = {
        action: Actions.addAnchor,
        arg1: anchor,
      };

      anchors.splice(removeIndex, 1);
      anchor.component.remove();
      history = getHistory(state.history, action, actionObject);

      return {
        ...state,
        anchors,
        history,
      };
    case actionTypes.ADD_VECTOR:
      vector = action.vector;

      let lineFunction = d3
        .line()
        .x(function(data) {
          return data.x;
        })
        .y(function(data) {
          return data.y;
        });

      //draw arrow head
      let path = state.vectorCanvas.append('path');
      let dx = vector[1].x - vector[0].x;
      let dy = vector[1].y - vector[0].y;
      let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      let headLength = 5;
      let headWidth = 3;
      let p = [
        vector[1].x - dx * headLength / d,
        vector[1].y - dy * headLength / d,
      ];
      let p1 = [p[0] - dy * headWidth / d, p[1] + dx * headWidth / d];
      let p2 = [p[0] + dy * headWidth / d, p[1] - dx * headWidth / d];
      let dataPath = [
        { x: p1[0], y: p1[1] },
        { x: vector[1].x, y: vector[1].y },
        { x: p2[0], y: p2[1] },
      ];

      path
        .attr('d', lineFunction(dataPath))
        .attr('stroke', 'red')
        .attr('fill', 'none');

      vector[1].path = path;

      actionObject = {
        action: Actions.removeVector,
        arg1: action.vector,
      };

      // draw arrow path if not already drawn
      if (action.isRedo || action.isUndo) {
        path = state.vectorCanvas.append('path');
        path
          .attr('stroke', '#000')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3, 5')
          .attr('stroke-linecap', 'round');
        let data = [
          { x: vector[0].x, y: vector[0].y },
          { x: vector[1].x, y: vector[1].y },
        ];
        path.attr('d', lineFunction(data));
        vector[0].path = path;
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
      removeIndex = state.vectors.length - 1;

      for (let i = state.vectors.length - 1; i >= 0; i--) {
        if (
          vector[0].x == vectors[i][0].x &&
          vector[1].x == vectors[i][1].x &&
          vector[0].y == vectors[i][0].y &&
          vector[1].y == vectors[i][1].y
        ) {
          removeIndex = i;
          break;
        }
      }

      actionObject = {
        action: Actions.addVector,
        arg1: vector,
      };

      vectors.splice(removeIndex, 1);
      action.vector[0].path.remove();
      action.vector[1].path.remove();

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
    default:
      return state;
  }
};
