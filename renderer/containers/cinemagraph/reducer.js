import * as Constants from './constants';

const initialState = {
  undoStack: [],
  redoStack: [],
  selectedVideoPath: '',
};

export const cinemagraphReducer = (state = initialState, action) => {
  switch (action.type) {
    case Constants.INITIALIZE_CINEMAGRAPH_CANVAS:
      return {
        ...state,
      };
    case Constants.SELECT_CINEMAGRAPH_VIDEO:
      return {
        ...state,
      };
    default:
      return state;
  }
};