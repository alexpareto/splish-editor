export const actionTypes = {
  GET_SELF_REQUEST: 'GET_SELF_REQUEST',
  GET_SELF_FAILURE: 'GET_SELF_FAILURE',
  GET_SELF_SUCCESS: 'GET_SELF_SUCCESS',
  UPDATE_SELF_REQUEST: 'UPDATE_SELF_REQUEST',
  UPDATE_SELF_SUCCESS: 'UPDATE_SELF_SUCCESS',
  UPDATE_SELF_FAILURE: 'UPDATE_SELF_FAILURE',
};

export const getSelfRequest = () => {
  return { type: actionTypes.GET_SELF_REQUEST };
};

export const getSelfFailure = errorMessage => {
  return { type: actionTypes.GET_SELF_FAILURE, errorMessage };
};

export const getSelfSuccess = user => {
  return { type: actionTypes.GET_SELF_SUCCESS, user };
};

export const updateSelfRequest = formData => {
  return {
    type: actionTypes.UPDATE_SELF_REQUEST,
    formData,
  };
};

export const updateSelfFailure = errorMessage => {
  return { type: actionTypes.UPDATE_SELF_FAILURE, errorMessage };
};

export const updateSelfSuccess = user => {
  return { type: actionTypes.UPDATE_SELF_SUCCESS, user };
};
