import { all } from 'redux-saga/effects';
import * as AuthSagas from '../containers/login/sagas';
import * as ExportsSagas from '../containers/exports/sagas';
import * as ProfileSagas from '../containers/profile/sagas';

function* rootSaga() {
  yield all([
    AuthSagas.loginUserSaga(),
    AuthSagas.signUpUserSaga(),
    ExportsSagas.uploadExportSaga(),
    ExportsSagas.getExportsSaga(),
    ProfileSagas.updateSelfSaga(),
    ProfileSagas.getSelfSaga(),
  ]);
}

export default rootSaga;
