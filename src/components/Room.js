import React from 'react'
import ChatRoom from './RoomComponents/ChatRoom';
import Display from './RoomComponents/Display';
import Participants from './RoomComponents/Participants';
import "../Styles/room.css"
function Room() {
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
