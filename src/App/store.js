import { configureStore } from '@reduxjs/toolkit';
import {createStore,combineReducers,applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { userReducer } from "../Reducers/UserReducers";
const reducer=combineReducers({
    user:userReducer,
})
const userInfoFromStorage=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):{}

const initialState={
    user:{userInfo:userInfoFromStorage}
}
const middleware=[thunk]
const store=createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))
// export default configureStore({
//     reducer:{
//         user:useReducer
//     }
// })
export default store