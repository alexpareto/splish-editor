import { actionTypes } from './actions';
import * as globalStyles from '../../globalStyles';
import * as d3 from 'd3';

const initialState = {
  undoStack: [],
  redoStack: [],
  imgPath: '',
  isInitialized: false,
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
  isRendering: false,
};

export const movingStillReducer = (state = initialState, action) => {
  let lc, mask;
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

      return {
        ...state,
        imageHeight,
        imgDimensions: {
          height: naturalHeight,
          width: naturalWidth,
        },
        isInitialized: true,
        currentTool: action.tool,
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
      let svg = d3.select('#movingStillSVG');
      let boundingRect = svg.node().getBoundingClientRect();
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
      let anchors = state.anchors;
      anchors.push(action.anchor);
      return {
        ...state,
        anchors,
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
      };
    default:
      return state;
  }
};
