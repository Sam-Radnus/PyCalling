import React from 'react'
import '../../Styles/room.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { config, useClient, useMicrophoneAndCameraTracks } from "./../../settings.js";
import AgoraRTC, { AgoraVideoPlayer, createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import { useSelector } from "react-redux"
import Participants from './Participants';
import { login,selectUser } from "./../../features/userSlice.js";
function Display(props) {


  let localScreenTracks=[];
  const x=useSelector(selectUser);
  const dispatch=useDispatch();
  const { users, tracks } = props;
  const client = useClient();
  const [screenShare,setScreenShare]=useState(false);
  const navigate=useNavigate();
  const [trackState, setTrackState] = useState(tracks[1]);
  const [mic,setMic]=useState(true);
  const [camera,setCamera]=useState(true);
  const screenSharing=async(e)=>{
        if(screenShare)
        {
          //STOP SCREEN SHARE
           setScreenShare(false);
           console.warn(screenShare)
           setTrackState(tracks[1]);
           await client.unpublish();
           await client.publish([tracks[1]]);
           
           
           console.warn('hey');
           console.warn(x);
        }
        else{
          console.warn(screenShare);
          setScreenShare(true)
          localScreenTracks=await AgoraRTC.createScreenVideoTrack();
          setTrackState(localScreenTracks);
          await client.unpublish([tracks[1]])
          await client.publish([localScreenTracks]);
      
    
        }
        //return <AgoraVideoPlayer className='vid' videoTrack={localScreenTracks} style={{ height: '100%', width: '100%' }} />
  }
  useEffect(()=>{
      console.warn(users);
  },[trackState])
  return (

    <>
     <Participants users={users}  />
      <section id="stream__container">
        <div id="big">

        </div>
      <div id="controller">
        <button className="controls" style={{color:'white',backgroundColor:camera?'blue':'red',marginLeft:'35%'}} onClick={()=>{
          
          console.warn(camera);
          tracks[1].muted?tracks[1].setMuted(false):tracks[1].setMuted(true);
          
          setCamera(tracks[1].muted);

        }} >
        
        <i className="fa-solid fa-camera"></i>
        </button>
        <button style={{color:'white',backgroundColor:mic?'blue':'red'}}   onClick={()=>{
          tracks[0].muted?tracks[0].setMuted(false):tracks[0].setMuted(true);
          setMic(tracks[0].muted)
          console.warn(mic);
        }}  className="controls">
         <i className={`fa-solid fa-microphone-lines${mic?'-slash':''}`}></i>
        </button>
        <button  className="controls" style={{color:'white',backgroundColor:screenShare?'red':'blue'}} id="screen-btn" onClick={screenSharing} >
        <i class="fa-solid fa-desktop"></i>
        </button>
        <button className="controls" style={{backgroundColor:'red'}} control="true" id="leave-btn" onClick={async()=>{
           await client.leave();
           client.removeAllListeners();
           tracks[0].close();
           tracks[1].close();
           client.leave();
           dispatch(
           login({
                name:'',
                room:'',
                loggedIn:false,
            }),
           )
           //setInCall(false);
           navigate('/');

        }} >
         <i  class="fa-solid fa-right-from-bracket"></i>
        </button>
        </div>
        {/* <div id="stream__box" >
          <div id="streams__container">
         
          </div>
          
        </div> */}
       
        <div id="stream__container">
         <div style={{display:'grid',gridTemplateColumns:'1fr 2fr'}}>
      
                         <div  style={{margin:'15px',height:'20vh',width:'20vw'}} id={`user`}>
              <AgoraVideoPlayer className='vid' videoTrack={trackState}  style={{ borderStyle:'solid',borderRadius:'5px',borderColor:'blue',height: '100%', width: '100%' }} />
                                                                                                                                                                                            
            </div>
            <div style={{ margin:'15px',height:'20vh',width:'20vw'}} id="videos">
        {users.length > 0 &&
                users.map((user) => {
                  if (user.videoTrack) {
                    
                    return (
                      <AgoraVideoPlayer className='vid' videoTrack={user.videoTrack} style={{  borderStyle:'solid',borderRadius:'5px',borderColor:'red',height: '100%', width: '100%' }} key={user.uid} />
                    );
                  } else return null;
                })}
                </div>
        </div>
        </div>
      
      </section>
    </>
  )
}

export default Display