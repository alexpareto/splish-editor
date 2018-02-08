import { actionTypes } from './actions';

const initialState = {
  uploadRequestSent: false,
  uploadHasError: false,
  getRequestSent: false,
  getRequestError: false,
  exports: [],
  lastUploadedExport: {},
};

export const exportReducer = (state = initialState, action) => {
  switch (action.type) {
    /* login */
    case actionTypes.UPLOAD_EXPORT_REQUEST:
      return {
        ...state,
        uploadRequestSent: true,
        uploadHasError: false,
        lastUploadedExport: {},
      };
    case actionTypes.UPLOAD_EXPORT_FAILURE:
      return {
        ...state,
        uploadRequestSent: false,
        uploadHasError: true,
      };
    case actionTypes.UPLOAD_EXPORT_SUCCESS:
      return {
        ...state,
        uploadRequestSent: false,
        uploadHasError: false,
        lastUploadedExport: action.data,
      };
    /* sign up */
    case actionTypes.GET_EXPORTS_REQUEST:
      return {
        ...state,
        getRequestSent: true,
        getRequestError: false,
      };
    case actionTypes.GET_EXPORTS_FAILURE:
      return {
        ...state,
        getRequestSent: false,
        getRequestError: true,
      };
    case actionTypes.GET_EXPORTS_SUCCESS:
      return {
        ...state,
        getRequestSent: false,
        getRequestError: false,
        exports: action.exports,
      };
    default:
      return state;
  }
};
