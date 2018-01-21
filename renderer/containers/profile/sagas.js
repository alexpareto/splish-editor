import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as Actions from './actions';

import * as api from '../../lib/api';

const getSelfCall = () => {
  return api.call('user/self', 'GET');
};

function* getSelf(action) {
  try {
    const res = yield call(getSelfCall);
    const data = yield res.json();
    if (data.error) {
      throw new Error(data.error);
    } else {
      yield put(Actions.getSelfSuccess(data));
    }
  } catch (e) {
    console.log(e);
    yield put(Actions.getSelfFailure(e));
  }
}

export function* getSelfSaga() {
  yield takeEvery(Actions.actionTypes.GET_SELF_REQUEST, getSelf);
}

const updateSelfCall = formData => {
  return api.call('user/self', 'POST', formData);
};

function* updateSelf(action) {
  try {
    const res = yield call(updateSelfCall, action.formData);
    const data = yield res.json();
    if (data.error) {
      throw new Error(data.error);
    } else {
      yield put(Actions.updateSelfSuccess(data));
    }
  } catch (e) {
    console.log(e);
    yield put(Actions.updateSelfFailure(e));
  }
}

export function* updateSelfSaga() {
  yield takeEvery(Actions.actionTypes.UPDATE_SELF_REQUEST, updateSelf);
}
