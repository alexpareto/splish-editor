import * as constants from './constants';

// ACTIONS
export const initializeCinemagraphCanvas = () => dispatch => {
	return dispatch({ type: constants.INITIALIZE_CINEMAGRAPH_CANVAS});
}

export const selectCinemagraphVideo = () => dispatch => {
	return dispatch({ type: constants.SELECT_CINEMAGRAPH_VIDEO});
}