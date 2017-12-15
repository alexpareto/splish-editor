import * as Constants from './constants';

const initialState = {
  undoStack: [],
  redoStack: [],
  test: "hello world",
};

export const cinemagraphReducer = (state = initialState, action) => {
  console.log("action called: ", action);
  switch (action.type) {
    case Constants.CHANGE_TEST:
      return {
        ...state,
        test: "hello redux world",
      };
    default:
      return state;
  }
};