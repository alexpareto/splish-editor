export const actionTypes = {
  UPLOAD_EXPORT_REQUEST: 'UPLOAD_EXPORT_REQUEST',
  UPLOAD_EXPORT_FAILURE: 'UPLOAD_EXPORT_FAILURE',
  UPLOAD_EXPORT_SUCCESS: 'UPLOAD_EXPORT_SUCCESS',
  GET_EXPORTS_REQUEST: 'GET_EXPORTS_REQUEST',
  GET_EXPORTS_FAILURE: 'GET_EXPORTS_FAILURE',
  GET_EXPORTS_SUCCESS: 'GET_EXPORTS_SUCCESS',
};

export const uploadExportRequest = file => {
  return { type: actionTypes.UPLOAD_EXPORT_REQUEST, file };
};

export const uploadExportFailure = errorMessage => {
  return { type: actionTypes.UPLOAD_EXPORT_FAILURE, errorMessage };
};

export const uploadExportSuccess = data => {
  return { type: actionTypes.UPLOAD_EXPORT_SUCCESS, data };
};

export const getExportsRequest = () => {
  return { type: actionTypes.GET_EXPORTS_REQUEST };
};

export const getExportsFailure = () => {
  return { type: actionTypes.GET_EXPORTS_FAILURE };
};

export const getExportsSuccess = exports => {
  return { type: actionTypes.GET_EXPORTS_SUCCESS, exports };
};
