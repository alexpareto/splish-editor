import { put, takeEvery } from 'redux-saga/effects';
import * as Actions from './actions';

function* undo(actionObject) {
  console.log('HELLO UNDO');
}

function* redo(actionObject) {
  console.log('HELLO REDO');
}

export function* undoSaga() {
  yield takeEvery(Actions.actionTypes.UNDO_MOVING_STILL, undo);
}

export function* redoSaga() {
  yield takeEvery(Actions.actionTypes.REDO_MOVING_STILL, redo);
}
