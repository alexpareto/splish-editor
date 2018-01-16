export const actionTypes = {
  LOGIN_USER_REQUEST: 'LOGIN_USER_REQUEST',
  LOGIN_USER_FAILURE: 'LOGIN_USER_FAILURE',
  LOGIN_USER_SUCCESS: 'LOGIN_USER_SUCCESS',
  SIGN_UP_USER_REQUEST: 'SIGN_UP_USER_REQUEST',
  SIGN_UP_USER_SUCCESS: 'SIGN_UP_USER_SUCCESS',
  SIGN_UP_USER_FAILURE: 'SIGN_UP_USER_FAILURE',
  LOGOUT_USER: 'LOGOUT_USER',
};

export const loginUserRequest = (email, password) => {
  return { type: actionTypes.LOGIN_USER_REQUEST, email, password };
};

export const loginUserFailure = errorMessage => {
  return { type: actionTypes.LOGIN_USER_FAILURE, errorMessage };
};

export const loginUserSuccess = (user, token) => {
  return { type: actionTypes.LOGIN_USER_SUCCESS, user, token };
};

export const signUpUserRequest = (email, password) => {
  return { type: actionTypes.SIGN_UP_USER_REQUEST, email, password };
};

export const signUpUserFailure = errorMessage => {
  return { type: actionTypes.SIGN_UP_USER_FAILURE, errorMessage };
};

export const signUpUserSuccess = (user, token) => {
  return { type: actionTypes.SIGN_UP_USER_SUCCESS, user, token };
};

export const logoutUser = () => {
  return { type: actionTypes.LOGOUT_USER };
};
