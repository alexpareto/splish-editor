import { all } from 'redux-saga/effects';
import * as AuthSagas from '../containers/login/sagas';
import * as ExportsSagas from '../containers/exports/sagas';

function* rootSaga() {
  yield all([
    AuthSagas.loginUserSaga(),
    AuthSagas.signUpUserSaga(),
    ExportsSagas.uploadExportSaga(),
    ExportsSagas.getExportsSaga(),
  ]);
}

export default rootSaga;
