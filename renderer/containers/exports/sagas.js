import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as Actions from './actions';

import * as api from '../../lib/api';

/*
* upload function
*/
const signedUrlCall = () => {
  return api.call('exports/gen', 'GET');
};

const postToAWS = (signedUrlData, file) => {
  const options = {
    method: 'PUT',
    body: file,
  };
  return fetch(signedUrlData.url, options);
};

const verifyWithDb = (
  signedUrl,
  title,
  description,
  license,
  privacy_level,
) => {
  console.log(signedUrl);
  const getUrl = signedUrl
    .substring(0, signedUrl.indexOf('?'))
    .replace('splish-exports.s3.amazonaws.com', 'cdn.splish.io');

  let body = new FormData();
  body.append('get_url', getUrl);
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
    // now use the signed url to post to AWS
    const awsRes = yield call(postToAWS, signedUrlData, action.file);
    if (!awsRes.ok) {
      throw new Error(`${awsRes.status}: ${awsRes.statusText}`);
    }

    // now create an entry in the DB
    const verifyWithDbRes = yield call(
      verifyWithDb,
      signedUrlData.url,
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
