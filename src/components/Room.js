import React from 'react'
import ChatRoom from './RoomComponents/ChatRoom';
import Display from './RoomComponents/Display';
import { useState, useEffect } from 'react';
import {  useClient, useMicrophoneAndCameraTracks } from "./../settings.js";
import "../Styles/room.css"
import {selectUser } from "./../features/userSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import  {
   
    createScreenVideoTrack,
} from "agora-rtc-react";

function Room() {
    let token=null;
   
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const [uid,setUid]=useState('');
    const client = useClient();
 //   const [channelName, setChannelName] = useState("");
    const [disolve,setDisolve]=useState(false);
    const appid = "9e4b87cc837448969b97b4301e2aca92";
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const  screen =createScreenVideoTrack();
    const [username,setName]=useState();
    const navigate = useNavigate();
  //  const channel=createChannel();
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
    },[]);
    useEffect(() => {
        let init = async (name) => { 
            console.log("init:", name);
            
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                
                setUid(user.uid);
                   if (mediaType === "video" ) {
                       setUsers((prevUsers) => {
                           return [...prevUsers, user];
                       });   
                       console.warn(users);
                   }
                   if (mediaType === "audio") {
                       user.audioTrack.play();
                       
    
                       
                   }

              
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
                let x=await client.join(appid, name,token,username.toString());
                  
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

        if (ready && tracks ) {
            console.log("init ready");
            
            let roomName=sessionStorage.getItem('room');
            init(roomName);
        }
    }, [client, ready, tracks]);
    useEffect(()=>{
       console.warn(users);
    },[users.length]);
    const handleChange=()=>{
        setDisolve((prev)=>!prev);
       // console.warn(disolve)
    }
    return (
        <main className="container">
            <div style={{backgroundColor:'#1A1E23'}} id="room__container">
            
                {start && tracks && screen && users &&  <ChatRoom uid={uid} clientRTC={client}  disolve={disolve} users={users} tracks={tracks}  /> } 
                {start && tracks && screen && users &&  <Display  users={users} screen={screen} onChange={handleChange} disolve={setDisolve} tracks={tracks} />}
              
            </div>
        </main>
    )
}

export default Room
