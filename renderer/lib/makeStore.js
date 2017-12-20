import {createStore} from "redux";
import reducer from "../containers/rootReducer";

const makeStore = (initialState, options) => {
    return createStore(reducer, initialState);
};

export default makeStore;