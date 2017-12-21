import * as Constants from './constants';

const initialState = {
  undoStack: [],
  redoStack: [],
  videoPath: '',
  canvas: {},
  tools: {},
};

export const cinemagraphReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.INITIALIZE_CINEMAGRAPH_CANVAS:
      var lc = LC.init(document.getElementsByClassName("literally core")[0]);
      var tools = {
        pencil: new LC.tools.Pencil(lc),
        eraser: new LC.tools.Eraser(lc)
      };

      lc.setTool(tools.pencil);
      console.log("LC", lc);

      return {
        ...state,
        canvas: lc,
        tools
      };
    case Constants.SELECT_CINEMAGRAPH_VIDEO:
      return {
        ...state,
        videoPath: action.files[0],
      };
    default:
      return state;
  }
};