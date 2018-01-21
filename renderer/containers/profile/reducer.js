import { actionTypes } from './actions';

const initialState = {
  requestSent: false,
  user: {},
  hasError: false,
  errorMessage: '',
};

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    /* listen for success to update state */
    case actionTypes.LOGIN_USER_SUCCESS:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SIGN_UP_USER_SUCCESS:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.GET_SELF_REQUEST:
      return {
        ...state,
        hasError: false,
        errorMessage: '',
      };
    case actionTypes.GET_SELF_SUCCESS:
      return {
        ...state,
        user: action.user,
        hasError: false,
        errorMessage: '',
      };
    case actionTypes.GET_SELF_FAILURE:
      return {
        ...state,
        hasError: true,
        errorMessage: action.errorMessage,
      };
    case actionTypes.UPDATE_SELF_REQUEST:
      return {
        ...state,
        hasError: false,
        errorMessage: '',
      };
    case actionTypes.UPDATE_SELF_SUCCESS:
      return {
        ...state,
        user: action.user,
        hasError: false,
        errorMessage: '',
      };
    case actionTypes.UPDATE_SELF_FAILURE:
      return {
        ...state,
        hasError: true,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
};
