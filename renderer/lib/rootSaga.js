import { all } from 'redux-saga/effects';
import * as AuthSagas from '../containers/login/sagas';

function* rootSaga() {
  yield all([AuthSagas.loginUserSaga(), AuthSagas.signUpUserSaga()]);
}

export default rootSaga;
