import { applyMiddleware, combineReducers, configureStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "@reduxjs/toolkit/dist/devtoolsExtension";
import useReducer from "../features/userSlice";
import { userReducer } from "../Reducers/UserReducers";
const reducer=combineReducers={
    user:userReducer
}
const userInfoFromStorage=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):null

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