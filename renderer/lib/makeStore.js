import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import reducer from "../containers/rootReducer";
import logger from "redux-logger"

const makeStore = (initialState, options) => {
    return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware, logger)));
};

export default makeStore;