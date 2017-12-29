import { actionTypes } from "./actions";
import * as globalStyles from "../../globalStyles";
import * as d3 from "d3";
console.log("D3: ", d3);

const initialState = {
  undoStack: [],
  redoStack: [],
  imgPath: "",
  isInitialized: false,
  imageHeight: 10,
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
      const parent = img.parentElement;
      const aspect = img.clientWidth / img.clientHeight;
      console.log("PARENT ELEMENT: ", parent);
      const imageHeight = img.clientHeight;
      parent.setAttribute("style", `height: ${imageHeight}px;`);

      let canvas = d3
        .select("#movingStillContainer")
        .append("svg")
        .attr("width", "80vw")
        .attr("height", `${imageHeight}px`);

      // var tools = {
      //   pencil: new LC.tools.Pencil(lc),
      //   eraser: new LC.tools.Eraser(lc)
      // };
      // tools.pencil.strokeWidth = 35;
      // tools.eraser.strokeWidth = 35;
      // const fill = LC.createShape("Rectangle", {
      //   x: 0,
      //   y: 0,
      //   width: vid.clientWidth,
      //   height: vid.clientHeight,
      //   strokeWidth: 1,
      //   strokeColor: globalStyles.accent,
      //   fillColor: globalStyles.accent
      // });
      // lc.saveShape(fill);
      // lc.setTool(tools.eraser);
      // lc.setColor("primary", globalStyles.secondary);
      // const boundingRect = {
      //   x: 0,
      //   y: 0,
      //   width: vid.clientWidth,
      //   height: vid.clientHeight
      // };

      return {
        ...state,
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
