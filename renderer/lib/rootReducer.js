import { combineReducers } from 'redux';
import { cinemagraphReducer } from '../containers/cinemagraph/reducer';
import { movingStillReducer } from '../containers/movingStill/reducer';
import { authReducer } from '../containers/login/reducer';

const rootReducer = combineReducers({
  cinemagraph: cinemagraphReducer,
  movingStill: movingStillReducer,
  auth: authReducer,
});

export default rootReducer;
