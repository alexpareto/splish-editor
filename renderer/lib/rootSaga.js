import { all } from 'redux-saga/effects';
import * as AuthSagas from '../containers/login/sagas';
import * as ExportsSagas from '../containers/exports/sagas';
import * as ProfileSagas from '../containers/profile/sagas';
import * as MovingStillSagas from '../containers/movingStill/sagas';

function* rootSaga() {
  yield all([
    AuthSagas.loginUserSaga(),
    AuthSagas.signUpUserSaga(),
    ExportsSagas.uploadExportSaga(),
    ExportsSagas.getExportsSaga(),
    ProfileSagas.updateSelfSaga(),
    ProfileSagas.getSelfSaga(),
    MovingStillSagas.undoSaga(),
    MovingStillSagas.redoSaga(),
  ]);
}

export default rootSaga;
