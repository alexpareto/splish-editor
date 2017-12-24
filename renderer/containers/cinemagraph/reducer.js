import { actionTypes } from "./actions";
import * as globalStyles from "../../globalStyles";
import getOverlayMask from "../../lib/cv/getOverlayMask";

const initialState = {
  undoStack: [],
  redoStack: [],
  videoPath: "",
  lc: null,
  tools: {},
  videoHeight: 10,
  boundingRect: {},
  viewMode: 'edit',
  overlayPath: ''
};

export const cinemagraphReducer = (state = initialState, action) => {
  let lc;
  switch (action.type) {
    case actionTypes.INITIALIZE_CINEMAGRAPH_CANVAS:
      const vid = document.getElementById("cinemagraphVideo");
      const aspect = vid.videoWidth / vid.videoHeight;
      const videoHeight = 80 / aspect;
      vid.parentElement.setAttribute("style", `height: ${videoHeight}vw;`);
      console.log("vid: ", vid.clientHeight);

      lc = LC.init(document.getElementsByClassName("literally core")[0]);
      var tools = {
        pencil: new LC.tools.Pencil(lc),
        eraser: new LC.tools.Eraser(lc)
      };
      tools.pencil.strokeWidth = 35;
      tools.eraser.strokeWidth = 35;
      const fill = LC.createShape("Rectangle", {
        x: 0,
        y: 0,
        width: vid.clientWidth,
        height: vid.clientHeight,
        strokeWidth: 1,
        strokeColor: globalStyles.accent,
        fillColor: globalStyles.accent
      });
      lc.saveShape(fill);
      lc.setTool(tools.eraser);
      lc.setColor("primary", globalStyles.secondary);
      const boundingRect = {
        x: 0,
        y: 0,
        width: vid.clientWidth,
        height: vid.clientHeight
      };

      return {
        ...state,
        lc,
        tools,
        videoHeight,
        boundingRect
      };
    case actionTypes.SELECT_CINEMAGRAPH_VIDEO:
      const videoPath = "file://" + action.files[0];
      return {
        ...state,
        videoPath
      };
    case actionTypes.ATTEMPT_PREVIEW_CINEMAGRAPH:
      // use cv to render an image mask to place over the video
      lc = state.lc;
      const mask = lc
        .getImage({ rect: state.boundingRect })
        .toDataURL()
        .split(",")[1];

      const overlayPath = getOverlayMask(mask, state.videoPath);

      return {
        ...state,
        overlayPath,
        viewMode: 'preview',
      };
    default:
      return state;
  }
};
