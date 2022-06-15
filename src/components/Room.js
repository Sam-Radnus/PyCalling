import React from 'react'
import ChatRoom from './RoomComponents/ChatRoom';
import Display from './RoomComponents/Display';
import Participants from './RoomComponents/Participants';
import "../Styles/room.css"
import { useEffect } from 'react';
function Room(props) {
    let {name}=props;
    useEffect(()=>{
        let name2=sessionStorage.getItem('name')
        console.log(name2);
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
