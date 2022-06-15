import React from 'react'
import ChatRoom from './RoomComponents/ChatRoom';
import Display from './RoomComponents/Display';
import Participants from './RoomComponents/Participants';
import "../Styles/room.css"
import { useEffect } from 'react';
import { logout,selectUser } from "./../features/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom";
function Room() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const user=useSelector(selectUser);
    useEffect(()=>{
        try{
        console.log(user.name);
        console.log(user.loggedIn);
       }
       catch(error)
       {
       
        console.log(error);
        navigate('/Lobby')
       }
    })
    return (
        <main className="container">
            <div id="room__container">
                <ChatRoom />
                <Display />
                <Participants />
            </div>
        </main>
    )
}

export default Room
