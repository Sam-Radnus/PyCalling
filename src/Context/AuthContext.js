import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true);
    
    const loginUser = async (username, password) => {
        const response = await fetch("https://socioauth-login.herokuapp.com/api/token/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
        });
        const data = await response.json();
    
        if (response.status === 200) {
          setAuthTokens(data);
          setUser(jwt_decode(data.access));
          //localStorage.setItem("authTokens", JSON.stringify(data));
          sessionStorage.setItem("authTokens", JSON.stringify(data));
        } else {
          alert("Something went wrong!");
        //  navigate('/');
        }
      };
    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        sessionStorage.removeItem('authTokens');
      //  navigate('/');
    }
    // let updateToken = async () => {
    //     let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ 'refresh': authTokens?.refresh })

    //     })
    //     let data = await response.json();
    //     console.log(data);
    //     if (response.status === 200) {
    //         setAuthTokens(data);
    //         setUser(jwt_decode(data.acess))
    //         localStorage.setItem('authTokens', JSON.stringify(data))
    //     }
    //     else {
    //         logoutUser();
    //     }
    //     if (loading) {
    //         setLoading(false);
    //     }
    // }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,

    }

  
    useEffect(() => {
        if (authTokens) {
          setUser(jwt_decode(authTokens.access));
        }
        setLoading(false);
      }, [authTokens, loading]);


    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}