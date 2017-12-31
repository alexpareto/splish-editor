import { actionTypes } from "./actions";
import * as globalStyles from "../../globalStyles";

const initialState = {
  undoStack: [],
  redoStack: [],
  imgPath: "",
  isInitialized: false,
  imageHeight: 0,
  boundingRect: {},
  currentTool: "",
  viewMode: "edit",
  overlayPath: "",
  renderPath: "",
  anchors: [],
  vectors: [],
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

      console.log("INITIALIZATION ACTION: ", action);
      return {
        ...state,
        imageHeight,
        isInitialized: true,
        currentTool: action.tool,
      };
    case actionTypes.SELECT_VECTOR_TOOL:
      return {
        ...state,
        currentTool: "vector",
      }
    case actionTypes.SELECT_ANCHOR_TOOL:
      return {
        ...state,
        currentTool: "anchor",
      }
    case actionTypes.ATTEMPT_PREVIEW_CINEMAGRAPH:
      // use cv to render an image mask to place over the video
      lc = state.lc;
      mask = lc
        .getImage({ rect: state.boundingRect })
        .toDataURL()
        .split(",")[1];

      const overlayPath = getOverlayMask(mask, state.videoPath);

      return {
        ...state,
        overlayPath,
        viewMode: "preview"
      };
    case actionTypes.START_CINEMAGRAPH_EDIT_MODE:
      return {
        ...state,
        viewMode: "edit"
      };
    case actionTypes.RENDER_CINEMAGRAPH:
      const renderPath = "file://" + action.path;
      lc = state.lc;
      mask = lc
        .getImage({ rect: state.boundingRect })
        .toDataURL()
        .split(",")[1];

      renderCinemagraph(mask, state.videoPath, renderPath);
      return {
        ...state,
        renderPath
      };
    case actionTypes.ADD_ANCHOR:
      let anchors = state.anchors;
      anchors.push(action.anchor);
      return {
        ...state,
        anchors,
      }
    case actionTypes.ADD_VECTOR:
      let vectors = state.vectors;
      vectors.push(action.vector);
      return {
        ...state,
        vectors,
      }
    default:
      return state;
  }
};
