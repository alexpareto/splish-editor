import { combineReducers } from 'redux';
import { cinemagraphReducer } from '../containers/cinemagraph/reducer';
import { movingStillReducer } from '../containers/movingStill/reducer';

const rootReducer = combineReducers({
  cinemagraph: cinemagraphReducer,
  movingStill: movingStillReducer,
});

export default rootReducer;
