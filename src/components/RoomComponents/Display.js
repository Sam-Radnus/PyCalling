import {React,useContext} from 'react'
import '../../Styles/room.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import AuthContext from '../../Context/AuthContext';
import {  useClient } from "./../../settings.js";
import AgoraRTC, { AgoraVideoPlayer } from "agora-rtc-react";
import { useSelector } from "react-redux"
import Participants from './Participants';
import { user_logout } from '../../Actions/UserActions';
//import { Popover } from 'react-tiny-popover'


function Display(props) {

  
  let localScreenTracks = [];
  
  const dispatch = useDispatch();
  const { users, tracks} = props;
  let {logoutUser}=useContext(AuthContext);
 
  const client = useClient();
  const [screenShare, setScreenShare] = useState(false);
 // const [isPopoverOpen, setIsPopoverOpen] = useState(false);
 // const [isPopoverOpen2, setIsPopoverOpen2] = useState(false);
  const navigate = useNavigate();
  const [trackState, setTrackState] = useState(tracks[1]);
  const [mic, setMic] = useState(true);
  const [videoConfigs, setVideoConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState('');
 // const [stats, setStats] = useState([]);
  const [second,setSecond]=useState('');
  const [isFull, setFull] = useState(false);
  //const [enabled,setEnabled]=useState(false);
  //const [opened,setOpened]=useState(false);
  const [isFull2, setFull2] = useState(false);
  const [volume, setVolume] = useState(100);
 // const [localStats, setLocalStats] = useState([]);
  const [camera, setCamera] = useState(true);
  const user=useSelector(state=>state.user)
  const {loading,userInfo}=user
  
  const screenSharing = async (e) => {
    if (screenShare) {
      //STOP SCREEN SHARE
      setScreenShare(false);
      console.warn(screenShare)
      setTrackState(tracks[1]);
      await client.unpublish();
      await client.publish([tracks[1]]);


      console.warn('hey');
      
    }
    else {
      console.warn(screenShare);
      setScreenShare(true)
      localScreenTracks = await AgoraRTC.createScreenVideoTrack();
      setTrackState(localScreenTracks);
      await client.unpublish([tracks[1]])
      await client.publish([localScreenTracks]);


    }
  }

    useEffect(() => {
      var videoProfiles = [
        { label: "480p_1", detail: "640×480, 15fps, 500Kbps", value: "480p_1" },
        { label: "480p_2", detail: "640×480, 30fps, 1000Kbps", value: "480p_2" },
        { label: "720p_1", detail: "1280×720, 15fps, 1130Kbps", value: "720p_1" },
        { label: "720p_2", detail: "1280×720, 30fps, 2000Kbps", value: "720p_2" },
        { label: "1080p_1", detail: "1920×1080, 15fps, 2080Kbps", value: "1080p_1" },
        { label: "1080p_2", detail: "1920×1080, 30fps, 3000Kbps", value: "1080p_2" },
        { label: "200×640", detail: "200×640, 30fps", value: { width: 200, height: 640, frameRate: 30 } } // custom video profile
      ]
        
       setVideoConfigs(videoProfiles);
       console.warn(videoConfigs);
     }, [ videoConfigs.length]);
    
  const tuneVolume = (op) => {
    let val = volume;
    (op === '+') ? setVolume(val + 25) : setVolume(val - 25);
    tracks[0].setVolume(volume);
    console.warn(op);
    console.warn(volume);
  }
 

  return (
    loading?<h1 style={{marginTop:"50%",width:"100%",zIndex:"99999999"}}>No One is Here</h1>:
    <>
      <Participants users={users} />
      <section id="stream__container">
        <div id="big">

        </div>
        <div style={{display:'flex'}} id="controller">
        <button className="controls" style={{ backgroundColor: '#3F8CFE', color: 'white', marginLeft: '0px'  }} onClick={() => { volume<100 && tuneVolume('+') }}> <i className="fa-solid fa-volume-high"></i> </button>
            <span style={{ fontSize: '15px', transition: '1ms ease-in',marginTop:'8px',marginLeft:'5px',width:'25px'}}>{volume + 25}</span>
            <button className="controls" style={{ backgroundColor: '#3F8CFE', color: 'white', marginRight: '15px' }} onClick={() => { volume>-1 &&  tuneVolume('-') }} > <i className="fa-solid fa-volume-low"></i> </button>
          <button className="controls" style={{ color: 'white', backgroundColor: camera ? '#3F8CFE' : '#F12646', marginLeft: '6%'}} onClick={() => {

            console.warn(camera);
            tracks[1].muted ? tracks[1].setMuted(false) : tracks[1].setMuted(true);

            setCamera(tracks[1].muted);

          }} >

            <i className="fa-solid fa-camera"></i>
          </button>


          <button style={{ color: 'white', backgroundColor: mic ? '#3F8CFE' : '#F12646' }} onClick={() => {
            tracks[0].muted ? tracks[0].setMuted(false) : tracks[0].setMuted(true);
        
            setMic(tracks[0].muted)
            console.warn(mic);
          }} className="controls">
            <i className={`fa-solid fa-microphone-lines${mic ? '-slash' : ''}`}></i>
          </button>
          <button className="controls" style={{ color: 'white', backgroundColor: screenShare ? '#F12646' : '#3F8CFE' }} id="screen-btn" onClick={screenSharing} >
            <i className="fa-solid fa-desktop"></i>
          </button>
          <button className="controls" style={{ backgroundColor: '#F12646' }} control="true" id="leave-btn" onClick={async () => {
            await client.leave();
            client.removeAllListeners();
            tracks[0].close();
            tracks[1].close();
            client.leave();
            // dispatch(
            //   login({
            //     name: '',
            //     room: '',
            //     loggedIn: false,
            //   }),
            // )
            navigate(-1);
            //setInCall(false);
            localStorage.clear()
            dispatch(user_logout(userInfo.uid))

          }} >
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
       
          <div style={{ display:'inline-flex', marginLeft: '5%' }}>
         

         
          <span style={{fontSize:'12px',width:'80px',paddingTop:'12px'}}>Video Config</span>
          <select multiple={false} id="config" name="configs" value={selectedConfig} onChange={(e) => {
            console.warn(e.target.value);
          
            setSelectedConfig(e.target.value);
            tracks[1].setEncoderConfiguration(e.target.value);
          }}>
            {videoConfigs.map(config =>
              <option key={config.value} value={config.label}>{config.label}</option>
            )};
          </select>
         
          </div>
        </div>
        {/* <div id="stream__box" >
          <div id="streams__container">
         
          </div>
          
        </div> */}

        <div  id="stream__container">  
        <div style={{position:'relative',width:'100%'}}> 
        <div className="Room__Name"><h1>{loading?'':userInfo.room_Name}</h1></div>
        

       
        
         </div>  
          <div  style={{marginLeft:'0vw'}} className={`grid-container`} >
   
            <div  style={{position:'relative',marginTop:'2vh',marginLeft:'1vw'}}onClick={() => {
              isFull ? setFull(false) : setFull(true)
            }
            } className={`${isFull ? 'full' : 'mid'}-screen`} id={`user`}>
             <span style={{position:'absolute',bottom:'2%',right:'2%',fontSize:'small',zIndex:999,cursor:'pointer',backgroundColor:'rgba(0,0,0,0.7)',padding:'5px',borderRadius:'5px'}}>{users[0]}</span>
              <AgoraVideoPlayer className='vid' videoTrack={trackState} style={{  borderRadius: '10px',height: '100%', width: '100%', borderWidth: '10px' }}  />

            </div>
              {users  ?
                users.map((user) => {
                  if (user.videoTrack) {

                    return (
                      <div style={{ position:'relative',margin: '15px'}} onClick={(e) => {
                        isFull2 ? setFull2(false) : setFull2(true)
                        console.warn(user.uid);
                        setSecond(user.uid);
                      }} className={`${isFull2 && second===user.uid  ? isFull?'full2':'full' :'mid'}-screen`} >
                        <span style={{position:'absolute',bottom:'2%',right:'2%',fontSize:'small',zIndex:999,backgroundColor:'rgba(0,0,0,0.7)',padding:'5px',borderRadius:'5px'}}>{user.uid}</span>
                      <AgoraVideoPlayer style={{ height: '100%', width: '100%'}} className='vid' videoTrack={user.videoTrack}  key={user.uid} />
                      </div>
                   );
                  } else return null;
                })
              :<div>
                <h1 style={{zIndex:"9999999",color:'white'}}>No one is here</h1>
              </div>
              }
         
          
          </div>
        </div>

      </section>
    </>
  )
}

export default Display