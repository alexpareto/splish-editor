import { actionTypes } from './actions';

const initialState = {
  requestSent: false,
  getSelfRequestSent: false,
  getSelfRequestError: false,
  user: {},
  token: '',
  hasError: false,
  errorMessage: '',
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    /* login */
    case actionTypes.LOGIN_USER_REQUEST:
      return {
        ...state,
        requestSent: true,
        hasError: false,
      };
    case actionTypes.LOGIN_USER_SUCCESS:
      window.localStorage.setItem('token', action.token);
      return {
        ...state,
        requestSent: false,
        user: action.user,
        token: action.token,
      };
    case actionTypes.LOGIN_USER_FAILURE:
      return {
        ...state,
        requestSent: false,
        hasError: true,
        errorMessage: action.errorMessage,
      };

    /* sign up */
    case actionTypes.SIGN_UP_USER_REQUEST:
      return {
        ...state,
        requestSent: true,
        hasError: false,
      };
    case actionTypes.SIGN_UP_USER_SUCCESS:
      window.localStorage.setItem('token', action.token);
      return {
        ...state,
        requestSent: false,
        user: action.user,
        token: action.token,
      };
    case actionTypes.SIGN_UP_USER_FAILURE:
      return {
        ...state,
        requestSent: false,
        hasError: true,
        errorMessage: action.errorMessage,
      };
    case actionTypes.LOGOUT_USER:
      window.localStorage.setItem('token', '');
      return initialState;
    case actionTypes.GET_SELF_REQUEST:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.GET_SELF_SUCCESS:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.GET_SELF_FAILURE:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};
