import * as constants from './constants';

// ACTIONS
export const changeTest = () => dispatch => {
  return dispatch({ type: constants.CHANGE_TEST })
}