import { combineReducers } from 'redux';
import { cinemagraphReducer } from './cinemagraph/reducer';

const rootReducer = combineReducers({
  cinemagraph: cinemagraphReducer,
});

export default rootReducer;
