import * as constants from './constants';

// ACTIONS
export const initializeCinemagraphCanvas = () => {
	return { type: constants.INITIALIZE_CINEMAGRAPH_CANVAS};
}

export const selectCinemagraphVideo = (files) => {
	return { type: constants.SELECT_CINEMAGRAPH_VIDEO, files: files };
}