import { combineReducers } from 'redux';
import { cinemagraphReducer } from '../containers/cinemagraph/reducer';
import { movingStillReducer } from '../containers/movingStill/reducer';
import { authReducer } from '../containers/login/reducer';
import { exportReducer } from '../containers/exports/reducer';
import { profileReducer } from '../containers/profile/reducer';

const rootReducer = combineReducers({
  cinemagraph: cinemagraphReducer,
  movingStill: movingStillReducer,
  auth: authReducer,
  exports: exportReducer,
  profile: profileReducer,
});

export default rootReducer;
