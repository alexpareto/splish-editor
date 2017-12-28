export const actionTypes = {
	INITIALIZE_MOVING_STILL_CANVAS: "INITIALIZE_MOVING_STILL_CANVAS",
	SELECT_MOVING_STILL_IMAGE: "SELECT_MOVING_STILL_IMAGE",
	UNDO_MOVING_STILL: "UNDO_MOVING_STILL",
	REDO_MOVING_STILL: "REDO_MOVING_STILL",
	START_MOVING_STILL_PREVIEW_MODE: "START_MOVING_STILL_PREVIEW_MODE",
	START_MOVING_STILL_EDIT_MODE: "START_MOVING_STILL_EDIT_MODE",
	SELECT_VECTOR_TOOL: "SELECT_VECTOR_TOOL",
	SELECT_ANCHOR_TOOL: "SELECT_ANCHOR_TOOL",
	RENDER_MOVING_STILL: "RENDER_MOVING_STILL",
};

// ACTIONS
export const initializeMovingStillCanvas = () => {
	return { type: actionTypes.INITIALIZE_MOVING_STILL_CANVAS };
};

export const selectMovingStillImage = (files) => {
	return { type: actionTypes.SELECT_MOVING_STILL_IMAGE, files };
};

export const startMovingStillEditMode = () => {
	return { type: actionTypes.START_MOVING_STILL_EDIT_MODE };
}

export const startMovingStillPreviewMode = () => {
	return { type: actionTypes.START_MOVING_PREVIEW_MODE };
}

export const renderMovingStill = (path) => {
	return { type: actionTypes.RENDER_MOVING_STILL, path };
}

