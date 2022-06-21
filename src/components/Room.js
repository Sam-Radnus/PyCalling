import React from 'react'
import ChatRoom from './RoomComponents/ChatRoom';
import Display from './RoomComponents/Display';
import Participants from './RoomComponents/Participants';
import { useState, useEffect } from 'react';
import { config, useClient, useMicrophoneAndCameraTracks } from "./../settings.js";
import "../Styles/room.css"
import { logout, selectUser } from "./../features/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    AgoraVideoPlayer,
    createClient,
    createMicrophoneAndCameraTracks,
    ClientConfig,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
    createScreenVideoTrack,
} from "agora-rtc-react";
import { createChannel } from 'agora-rtm-react';
function Room() {
    let token=null;
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const client = useClient();
    const appid = "9e4b87cc837448969b97b4301e2aca92";
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const  screen =createScreenVideoTrack();
    const [username,setName]=useState();
    const navigate = useNavigate();
    const channel=createChannel();
    const x = useSelector(selectUser);
    


    useEffect(() => {
        try {
            console.log(x.name);
            setName(x.name);
            console.log(x.loggedIn);
        }
        catch (error) {
            console.warn(error);
            navigate('/Lobby')
        }
        if(!x.loggedIn)
        {
            navigate('/Lobby')
        }
    });
    useEffect(() => {
        let init = async (name) => { 
            console.log("init", name);
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                if (mediaType === "video") {
                    setUsers((prevUsers) => {
                        return [...prevUsers, user];
                    });   
                }
                if (mediaType === "audio") {
                    user.audioTrack.play();
                }
                let members=await channel.getMembers()
                console.warn(members);
            });
            client.on("user-unpublished",(user, type) => {
                console.log("unpublished", user, type);
                if (type === "audio") {
                    user.audioTrack?.stop();
                    
                }
                if (type === "video") {
                    setUsers((prevUsers) => {
                        return prevUsers.filter((User) => User.uid !== user.uid);
                    });
                }
            });

            client.on("user-left", (user) => {
                console.log("leaving", user);
                setUsers((prevUsers) => {
                    return prevUsers.filter((User) => User.uid !== user.uid);
                });
            });
            try{
            let x=await client.join(appid, name,token, username.toString());
            console.warn(x);
            setUsers((prevUsers)=>{
                return [...prevUsers,x];
            })
            console.warn(users);
            }
           catch(error)
           {
             console.error(error);
           }
            if (tracks) await client.publish([tracks[0], tracks[1]],screen);
            setStart(true);

        };

        if (ready && tracks) {
            console.log("init ready");
            init('main');
        }
    }, [client, ready, tracks]);
    
    return (
        <main className="container">
            <div id="room__container">
                {start && tracks && screen && users &&  <ChatRoom /> }
                {start && tracks && screen && users && <Display users={users} screen={screen} tracks={tracks} />}
                {start && tracks && screen && users &&  <Participants users={users} /> }
            </div>
        </main>
    )
}

export default Room
