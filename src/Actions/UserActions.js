import {
    USER_LOGIN_REQUEST,USER_LOGIN_SUCCESS,USER_LOGIN_FAILURE,USER_LOGOUT
} from '../Constants/UserConstants'

export const loginUser=(email,password)=>async(dispatch)=>{
    try{
        dispatch({type:USER_LOGIN_REQUEST})
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
        const {data}=await axios.post('api/users/login/',{
            'username':email,
            'password':password
        },
          config
        )
        dispatch({
            type:USER_LOGIN_SUCCESS,
            payload:data
        })
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

export const logout=()=>{
    dispatch({type:USER_LOGOUT})
    localStorage.removeItem('userInfo')
}
















