import React from 'react'
import ChatRoom from './RoomComponents/ChatRoom';
import Display from './RoomComponents/Display';
import { useState, useEffect } from 'react';
import {  useClient, useMicrophoneAndCameraTracks } from "./../settings.js";
import "../Styles/room.css"

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Actions/UserActions"; 
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
    const appid = process.env.REACT_APP_AGORA_APP_ID;
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const  screen =createScreenVideoTrack();
    const [username,setName]=useState();
    const navigate = useNavigate();
  //  const channel=createChannel();
    const user=useSelector(state=>state.user)
    const {loading,userInfo}=user
    
    useEffect(() => {
        console.warn("hello",userInfo);
        console.warn(loading);
        try {

            console.warn(userInfo.name);
            setName(userInfo.name);
            console.warn(userInfo.uid);
        }
        catch (error) {
            console.warn(error);
           // navigate('/Lobby')
        }
         if(userInfo)
         {
             navigate('/Lobby')
         }
    },[]);
    useEffect(() => {
        let init = async (name) => { 
            console.warn(userInfo)
            console.warn("init:", name);
           
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
                console.warn(userInfo.name);
                let x=await client.join(appid, userInfo.room_Name,null,userInfo.name.toString());
                  
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

        if (ready && tracks  ) {
            console.log("init ready");
            
            //let roomName=sessionStorage.getItem('room');
            //console.warn(roomName);
            init('TV');
        }
    }, [client, ready, tracks]);
    
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
