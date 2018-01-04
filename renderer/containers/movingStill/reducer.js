import { actionTypes } from "./actions";
import * as globalStyles from "../../globalStyles";
import * as d3 from "d3";

const initialState = {
  undoStack: [],
  redoStack: [],
  imgPath: "",
  isInitialized: false,
  imageHeight: 0,
  currentTool: "",
  viewMode: "edit",
  anchors: [],
  vectors: [],
  boundingRect: {},
};

export const movingStillReducer = (state = initialState, action) => {
  let lc, mask;
  switch (action.type) {
    case actionTypes.SELECT_MOVING_STILL_IMAGE:
      const imgPath = "file://" + action.files[0];
      return {
        ...state,
        imgPath
      };
    case actionTypes.INITIALIZE_MOVING_STILL_CANVAS:
      const img = document.getElementById("movingStillImage");
      const imageHeight = img.clientHeight;
      return {
        ...state,
        imageHeight,
        isInitialized: true,
        currentTool: action.tool
      };
    case actionTypes.SELECT_VECTOR_TOOL:
      return {
        ...state,
        currentTool: "vector"
      };
    case actionTypes.SELECT_ANCHOR_TOOL:
      return {
        ...state,
        currentTool: "anchor"
      };
    case actionTypes.START_MOVING_STILL_PREVIEW_MODE:
      let svg = d3.select("#movingStillSVG");
      let boundingRect = svg.node().getBoundingClientRect();
      return {
        ...state,
        viewMode: "preview",
        boundingRect,
      };
    case actionTypes.START_MOVING_STILL_EDIT_MODE:
      return {
        ...state,
        viewMode: "edit"
      };
    case actionTypes.RENDER_MOVING_STILL:
      const renderPath = "file://" + action.path;
      return {
        ...state
      };
    case actionTypes.ADD_ANCHOR:
      let anchors = state.anchors;
      anchors.push(action.anchor);
      return {
        ...state,
        anchors
      };
    case actionTypes.ADD_VECTOR:
      let vectors = state.vectors;
      vectors.push(action.vector);
      return {
        ...state,
        vectors
      };
    default:
      return state;
  }
};
