import { put, takeEvery } from 'redux-saga/effects';
import * as Actions from './actions';

function* undo(action) {
  let undo = action.actionObject;
  yield put(undo.action(true, false, undo.arg1, undo.arg2, undo.arg3));
}

function* redo(action) {
  let redo = action.actionObject;
  yield put(redo.action(false, true, redo.arg1, redo.arg2, redo.arg3));
}

export function* undoSaga() {
  yield takeEvery(Actions.actionTypes.UNDO_CINEMAGRAPH, undo);
}

export function* redoSaga() {
  yield takeEvery(Actions.actionTypes.REDO_CINEMAGRAPH, redo);
}
