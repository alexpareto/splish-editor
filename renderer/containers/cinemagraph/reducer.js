import { actionTypes } from "./actions";
import * as globalStyles from "../../globalStyles";
import getOverlayMask from '../../lib/cv/getOverlayMask';

const initialState = {
  undoStack: [],
  redoStack: [],
  videoPath: "",
  lc: null,
  tools: {},
  videoHeight: 10
};

export const cinemagraphReducer = (state = initialState, action) => {
  let lc;
  switch (action.type) {
    case actionTypes.INITIALIZE_CINEMAGRAPH_CANVAS:
      const vid = document.getElementById("cinemagraphVideo");
      const aspect = vid.videoWidth / vid.videoHeight;
      const videoHeight = 70 / aspect;
      vid.parentElement.setAttribute("style", `height: ${videoHeight}vw;`);

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
        width: vid.videoWidth,
        height: vid.videoHeight,
        strokeWidth: 5,
        strokeColor: globalStyles.accent,
        fillColor: globalStyles.accent
      });
      lc.saveShape(fill);
      lc.setTool(tools.eraser);
      lc.setColor("primary", globalStyles.secondary);

      console.log("LC: ", lc);
      return {
        ...state,
        lc,
        tools,
        videoHeight
      };
    case actionTypes.SELECT_CINEMAGRAPH_VIDEO:
      const videoPath = "file://" + action.files[0];
      return {
        ...state,
        videoPath
      };
    case actionTypes.ATTEMPT_PREVIEW_CINEMAGRAPH:
      // use cv to render an image mask to place over the video
      console.log("PREVIEWING!!!");
      // lc = state.lc;
      // const mask = lc.getImage();
      getOverlayMask();

      return {
        ...state,
      }
    default:
      return state;
  }
};
