import { combineReducers } from 'redux';
import { cinemagraphReducer } from '../containers/cinemagraph/reducer';
import { movingStillReducer } from '../containers/movingStill/reducer';
import { authReducer } from '../containers/login/reducer';
import { exportReducer } from '../containers/exports/reducer';

const rootReducer = combineReducers({
  cinemagraph: cinemagraphReducer,
  movingStill: movingStillReducer,
  auth: authReducer,
  exports: exportReducer,
});

export default rootReducer;
