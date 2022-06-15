import React from 'react'
import ChatRoom from './RoomComponents/ChatRoom';
import Display from './RoomComponents/Display';
import Participants from './RoomComponents/Participants';
import "../Styles/room.css"
import { useEffect } from 'react';
import { logout,selectUser } from "./../features/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
function Room(props) {
    const dispatch=useDispatch();
    const user=useSelector(selectUser);
    let {name}=props;
    useEffect(()=>{
        let name2=sessionStorage.getItem('name')
        console.log(user.name);
    },[props.name])
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
