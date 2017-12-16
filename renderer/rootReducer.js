import { combineReducers } from 'redux';
import { cinemagraphReducer } from '../redux/cinemagraph/reducer';

const rootReducer = combineReducers({
  cinemagraph: cinemagraphReducer,
});

export default rootReducer;
