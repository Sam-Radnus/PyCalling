import {
    USER_LOGIN_REQUEST,USER_LOGIN_SUCCESS,USER_LOGIN_FAILURE,USER_LOGOUT
} from '../Constants/UserConstants'
import axios from "axios"
export const loginUser=(Name,Uid,room_Name)=>async(dispatch)=>{
    try{
        
        console.log("Login Request")
        console.log(Name)
        console.log(Uid)
        console.log(room_Name)
        dispatch({type:USER_LOGIN_REQUEST})
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
        const {data}=await axios.post('http://127.0.0.1:8000/api/join',
        {
            "name":Name,
            "uid":Uid,
            "room_Name":room_Name
        },
          config
        )
        console.log(data);
        dispatch({
            type:USER_LOGIN_SUCCESS,
            payload:data
        })
        console.log("Login Succesful")
        localStorage.setItem('userInfo',JSON.stringify(data))
    }
    catch(error)
    {
        dispatch({
            type:USER_LOGIN_FAILURE,
            payload:error.response && error.response.data.detail ? error.response.data.detail:error.message
        })
    }
}

export const logout=()=>(dispatch)=>{
    dispatch({type:USER_LOGOUT})
    localStorage.removeItem('userInfo')
}
















