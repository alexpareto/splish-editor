import {createStore} from "redux";
import reducer from "./rootReducer";

const makeStore = (initialState, options) => {
    return createStore(reducer, initialState);
};

export default makeStore;