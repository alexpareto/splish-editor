import * as Constants from './constants';

const initialState = {
  undoStack: [],
  redoStack: [],
  videoPath: '',
  canvas: {},
  tools: {},
  videoHeight: 10,
};

export const cinemagraphReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.INITIALIZE_CINEMAGRAPH_CANVAS:
      var lc = LC.init(document.getElementsByClassName("literally core")[0]);
      var tools = {
        pencil: new LC.tools.Pencil(lc),
        eraser: new LC.tools.Eraser(lc)
      };
      const vid = document.getElementById("cinemagraphVideo");
      const aspect = vid.videoWidth / vid.videoHeight;
      const videoHeight = 70 / aspect;
      tools.pencil.strokeWidth = 35;
      console.log("TOOLS: ", tools);
      lc.setTool(tools.pencil);

      return {
        ...state,
        canvas: lc,
        tools,
        videoHeight,
      };
    case Constants.SELECT_CINEMAGRAPH_VIDEO:
      const videoPath = 'file://' + action.files[0];
      return {
        ...state,
        videoPath,
      };
    default:
      return state;
  }
};