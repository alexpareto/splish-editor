import { combineReducers } from 'redux';
import { cinemagraphReducer } from '../containers/cinemagraph/reducer';

const rootReducer = combineReducers({
  cinemagraph: cinemagraphReducer,
});

export default rootReducer;
