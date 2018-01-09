export const actionTypes = {
	INITIALIZE_CINEMAGRAPH_CANVAS: 'INITIALIZE_CINEMAGRAPH_CANVAS',
	SELECT_CINEMAGRAPH_VIDEO: 'SELECT_CINEMAGRAPH_VIDEO',
	UNDO_CINEMAGRAPH: 'UNDO_CINEMAGRAPH',
	REDO_CINEMAGRAPH: 'REDO_CINEMAGRAPH',
	RENDER_CINEMAGRAPH: 'RENDER_CINEMAGRAPH',
	ATTEMPT_PREVIEW_CINEMAGRAPH: 'ATTEMPT_PREVIEW_CINEMAGRAPH',
	PREVIEW_CINEMAGRAPH_SUCCESS: 'PREVIEW_CINEMAGRAPH_SUCCESS',
	PREVIEW_CINEMAGRAPH_FAILURE: 'PREVIEW_CINEMAGRAPH_FAILURE',
	START_CINEMAGRAPH_EDIT_MODE: 'START_CINEMAGRAPH_EDIT_MODE',
};

// ACTIONS
export const initializeCinemagraphCanvas = () => {
	return { type: actionTypes.INITIALIZE_CINEMAGRAPH_CANVAS};
}

export const selectCinemagraphVideo = (files) => {
	console.log("IN THE ACTION: ", files);
	return { type: actionTypes.SELECT_CINEMAGRAPH_VIDEO, files: files };
}

export const attemptPreviewCinemagraph = () => {
	return { type: actionTypes.ATTEMPT_PREVIEW_CINEMAGRAPH };
}

export const startCinemagraphEditMode = () => {
	return { type: actionTypes.START_CINEMAGRAPH_EDIT_MODE };
}

export const renderCinemagraph = (path) => {
	return { type: actionTypes.RENDER_CINEMAGRAPH, path: path };
}