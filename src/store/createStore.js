import { createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import makeRootReducer from './reducers';
import { createLogger } from 'redux-logger';

import createSocketIoMiddleware from "redux-socket.io";

import io from "socket.io-client/dist/socket.io";

let socket = io("http://localhost:3000", {jsonp:false});
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

const log =  createLogger({ diff: true, collapsed: true });

//Function which can create the store and auto-persist the data
export default (initialState = {}) => {

    //Middleware configuration
    const middleware = [thunk, log, socketIoMiddleware];

    //Store enhancers
    const enhancers = [];

    //Store instantiation
    const store = createStore(
        makeRootReducer(),
        initialState,
        compose(
            applyMiddleware(...middleware),
            ...enhancers
        )
    );
    return store;
};