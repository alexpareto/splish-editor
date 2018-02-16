import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as Actions from './actions';

import * as api from '../../lib/api';

/*
* upload function
*/
const signedUrlCall = () => {
  return api.call('exports/gen', 'GET');
};

const postToAWS = (signedUrl, file) => {
  const options = {
    method: 'PUT',
    body: file,
  };
  return fetch(signedUrl, options);
};

const verifyWithDb = (
  videoUrl,
  imageUrl,
  dimensions,
  title,
  description,
  license,
  privacy_level,
) => {
  const getUrl = videoUrl
    .substring(0, videoUrl.indexOf('?'))
    .replace('splish-exports.s3.amazonaws.com', 'cdn.splish.io');

  const posterImageUrl = imageUrl
    .substring(0, imageUrl.indexOf('?'))
    .replace('splish-exports.s3.amazonaws.com', 'cdn.splish.io');

  let body = new FormData();
  body.append('get_url', getUrl);
  body.append('poster_image_url', posterImageUrl);
  body.append('width', dimensions.width);
  body.append('height', dimensions.height);
  body.append('title', title);
  body.append('description', description);
  body.append('license', license);
  body.append('privacy_level', privacy_level);

  return api.call('exports/new', 'POST', body);
};

function* uploadExport(action) {
  try {
    // first get signed url
    const signedUrlRes = yield call(signedUrlCall);
    const signedUrlData = yield signedUrlRes.json();
    if (signedUrlData.error) {
      throw new Error(signedUrlData.error);
    }

    // now use the signed urls to post to AWS
    const awsRes = yield call(postToAWS, signedUrlData.url, action.videoFile);
    const awsRes2 = yield call(
      postToAWS,
      signedUrlData.poster_image_url,
      action.previewFile,
    );

    if (!awsRes.ok) {
      throw new Error(`${awsRes.status}: ${awsRes.statusText}`);
    }

    if (!awsRes2.ok) {
      throw new Error(`${awsRes2.status}: ${awsRes2.statusText}`);
    }

    // now create an entry in the DB
    const verifyWithDbRes = yield call(
      verifyWithDb,
      signedUrlData.url,
      signedUrlData.poster_image_url,
      action.dimensions,
      action.title,
      action.description,
      action.license,
      action.privacy_level,
    );
    if (!verifyWithDbRes.ok) {
      throw new Error(
        `${verifyWithDbRes.status}: ${verifyWithDbRes.statusText}`,
      );
    }
    // nice all is well
    const verifyWithDbJson = yield verifyWithDbRes.json();
    yield put(Actions.uploadExportSuccess(verifyWithDbJson));
    yield put(Actions.getExportsRequest());
  } catch (e) {
    console.log(e);
    yield put(Actions.uploadExportFailure());
  }
}

export function* uploadExportSaga() {
  yield takeEvery(Actions.actionTypes.UPLOAD_EXPORT_REQUEST, uploadExport);
}

const getExportsCall = () => {
  return api.call('exports/all', 'GET');
};

function* getExports(action) {
  try {
    // request all exports
    const res = yield call(getExportsCall);
    const data = yield res.json();
    yield put(Actions.getExportsSuccess(data));
  } catch (e) {
    console.log(e);
    yield put(Actions.getExportsFailure());
  }
}

export function* getExportsSaga() {
  yield takeEvery(Actions.actionTypes.GET_EXPORTS_REQUEST, getExports);
}

const saveExportCall = (public_id, description, privacy_level) => {
  let formData = new FormData();
  formData.append('description', description);
  formData.append('privacy_level', privacy_level);
  formData.append('public_id', public_id);
  return api.call('exports/update', 'POST', formData);
};

function* saveExport(action) {
  try {
    // request all exports
    const res = yield call(
      saveExportCall,
      action.public_id,
      action.description,
      action.privacy_level,
    );

    if (!res.ok) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }

    const data = yield res.json();
    yield put(Actions.saveExportSuccess(data));
  } catch (e) {
    console.log(e);
    yield put(Actions.getExportsFailure());
  }
}

export function* saveExportsSaga() {
  yield takeEvery(Actions.actionTypes.SAVE_EXPORT_REQUEST, saveExport);
}
