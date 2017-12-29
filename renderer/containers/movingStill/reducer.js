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
  canvas: {}
};

export const movingStillReducer = (state = initialState, action) => {
  let lc, mask;
  switch (action.type) {
    case actionTypes.INITIALIZE_MOVING_STILL_CANVAS:
      const img = document.getElementById("movingStillImage");
      const imageHeight = img.clientHeight;

      return {
        ...state,
        imageHeight,
        isInitialized: true
      };
    case actionTypes.SELECT_MOVING_STILL_IMAGE:
      const imgPath = "file://" + action.files[0];
      return {
        ...state,
        imgPath
      };
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
    default:
      return state;
  }
};
