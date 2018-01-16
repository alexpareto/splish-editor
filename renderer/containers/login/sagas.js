import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as Actions from './actions';

import * as api from '../../lib/api';

const loginUserCall = (email, password) => {
  let formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  return api.call('auth/login', 'POST', formData);
};

function* loginUser(action) {
  try {
    const res = yield call(loginUserCall, action.email, action.password);
    const data = yield res.json();
    if (data.error) {
      yield put(Actions.loginUserFailure(data.error));
    } else {
      yield put(Actions.loginUserSuccess(data.user, data.token));
    }
  } catch (e) {
    console.log(e);
    yield put(Actions.loginUserFailure());
  }
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
export function* loginUserSaga() {
  yield takeEvery(Actions.actionTypes.LOGIN_USER_REQUEST, loginUser);
}

const signUpUserCall = (email, password) => {
  let formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  return api.call('auth/sign-up', 'POST', formData);
};

function* signUpUser(action) {
  try {
    const res = yield call(signUpUserCall, action.email, action.password);
    const data = yield res.json();
    if (data.error) {
      yield put(Actions.signUpUserFailure(data.error));
    } else {
      yield put(Actions.signUpUserSuccess(data.user, data.token));
    }
  } catch (e) {
    console.log(e);
    yield put(Actions.signUpUserFailure());
  }
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
export function* signUpUserSaga() {
  yield takeEvery(Actions.actionTypes.SIGN_UP_USER_REQUEST, signUpUser);
}
