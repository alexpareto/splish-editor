export const actionTypes = {
  UPLOAD_EXPORT_REQUEST: 'UPLOAD_EXPORT_REQUEST',
  UPLOAD_EXPORT_FAILURE: 'UPLOAD_EXPORT_FAILURE',
  UPLOAD_EXPORT_SUCCESS: 'UPLOAD_EXPORT_SUCCESS',
  GET_EXPORTS_REQUEST: 'GET_EXPORTS_REQUEST',
  GET_EXPORTS_FAILURE: 'GET_EXPORTS_FAILURE',
  GET_EXPORTS_SUCCESS: 'GET_EXPORTS_SUCCESS',
  SAVE_EXPORT_REQUEST: 'SAVE_EXPORT_REQUEST',
  SAVE_EXPORT_SUCCESS: 'SAVE_EXPORT_SUCCESS',
  SAVE_EXPORT_FAILURE: 'SAVE_EXPORT_FAILURE',
};

export const uploadExportRequest = (
  videoFile,
  previewFile,
  dimensions,
  title,
  description,
  license,
  privacy_level,
) => {
  return {
    type: actionTypes.UPLOAD_EXPORT_REQUEST,
    videoFile,
    previewFile,
    dimensions,
    title,
    description,
    license,
    privacy_level,
  };
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

export const saveExportRequest = (public_id, description, privacy_level) => {
  return {
    type: actionTypes.SAVE_EXPORT_REQUEST,
    public_id,
    description,
    privacy_level,
  };
};

export const saveExportFailure = () => {
  return { type: actionTypes.SAVE_EXPORT_FAILURE };
};

export const saveExportSuccess = exportItem => {
  return { type: actionTypes.SAVE_EXPORT_SUCCESS, exportItem };
};
