import {
    USER_LOGIN_REQUEST,USER_LOGIN_SUCCESS,USER_LOGIN_FAILURE,USER_LOGOUT
} from '../Constants/UserConstants'
import axios from "axios"
export const loginUser=(Name,Uid,isAdmin,room_Name)=>async(dispatch)=>{
    try{
        
        console.log("Login Request")
        console.log(Name)
        console.log(Uid)
        console.log(room_Name)
        console.warn(isAdmin);
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
            "isAdmin":isAdmin,
            "room_Name":room_Name
        },
          config
        )
        console.warn("1");
        console.warn(data);
        console.warn("2");
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

export const user_logout=(uid)=>(dispatch)=>{
    dispatch({type:USER_LOGOUT})
    axios.get(`http://127.0.0.1:8000/api/leave/${uid}`)
    localStorage.removeItem('userInfo')
}
















