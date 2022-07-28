import {React,useContext} from 'react'
import '../../Styles/room.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import AuthContext from '../../Context/AuthContext';
import { config, useClient, useMicrophoneAndCameraTracks } from "./../../settings.js";
import AgoraRTC, { AgoraVideoPlayer, createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import { useSelector } from "react-redux"
import Participants from './Participants';
import { login, selectUser } from "./../../features/userSlice.js";
import { Popover } from 'react-tiny-popover'
import image1 from './../images/Lani.png'
import image2 from './../images/Elizabeth.png';
import image3 from './../images/you.png';
import image4 from './../images/Niesha.png' ;
import image5 from './../images/Josh.png' ;
import image6 from './../images/Alexander.png' ;
import {AIDenoiserExtension} from "agora-extension-ai-denoiser";

function Display(props) {

  
  let localScreenTracks = [];
  const x = useSelector(selectUser);
  const dispatch = useDispatch();
  const { users, tracks } = props;
  let {loginUser,authTokens,logoutUser}=useContext(AuthContext);
 
  const client = useClient();
  const [screenShare, setScreenShare] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPopoverOpen2, setIsPopoverOpen2] = useState(false);
  const navigate = useNavigate();
  const [trackState, setTrackState] = useState(tracks[1]);
  const [mic, setMic] = useState(true);
  const [videoConfigs, setVideoConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState([]);
  const [stats, setStats] = useState([]);
  const [second,setSecond]=useState('');
  const [isFull, setFull] = useState(false);
  const [enabled,setEnabled]=useState(false);
  const [opened,setOpened]=useState(false);
  const [isFull2, setFull2] = useState(false);
  const [volume, setVolume] = useState(100);
  const [localStats, setLocalStats] = useState([]);
  const [camera, setCamera] = useState(true);
  const screenSharing = async (e) => {
    if (screenShare) {
      //STOP SCREEN SHARE
      setScreenShare(false);
      console.warn(screenShare)
      setTrackState(tracks[1]);
      await client.unpublish();
      await client.publish([tracks[1]]);


      console.warn('hey');
      console.warn(x);
    }
    else {
      console.warn(screenShare);
      setScreenShare(true)
      localScreenTracks = await AgoraRTC.createScreenVideoTrack();
      setTrackState(localScreenTracks);
      await client.unpublish([tracks[1]])
      await client.publish([localScreenTracks]);


    }
    //return <AgoraVideoPlayer className='vid' videoTrack={localScreenTracks} style={{ height: '100%', width: '100%' }} />
  }
  let denoiser=null;
  let processor=null;
  let processorEnable=true;
  const pipeAIDenosier = async(audioTrack, processor) => {
    
    await audioTrack.pipe(processor).pipe(audioTrack.processorDestination);
    
  }
   let openAIDenoiser=async()=>{
 
       denoiser=denoiser|| ((()=>{
          let denoiser = new AIDenoiserExtension({
            assetsPath:'./aiDenoiserExtension/external'
          });
          console.warn(denoiser);
          AgoraRTC.registerExtensions([denoiser]);
          denoiser.onloaderror=(e)=>{
            console.error(e);
            processor=null;
          }
          return denoiser;
   })())
        processor=processor||((()=>{
          let processor=denoiser.createProcessor();
          console.error(processor);
       
          processor.onoverload=async()=>{
             console.log("overload!!!");
             try{
              await processor.disable();
              setEnabled(false);
              processorEnable=true;
             }
             catch(error)
             {
              console.error("disable AIDenoiser Failure");
             }
             finally{
                 console.log('enabled');
               
             }
          }
          return processor;
        })());
   
        
        pipeAIDenosier(tracks[0],processor);
   }
  
   let enableAiDenoiser=async()=>{
   
    if(processorEnable)
    {
      try{
        await processor.enable();
        processorEnable=false;
      }
      catch(e){
        console.error("enable Denoiser Failure");
      }
      finally{
        console.error(processor);
      }
    }else{
       try{
        await processor.disable();
        processorEnable=true;
       }
       catch(e){
        console.error("disable AIDenoiser Failure");
       }
       finally{

       }
    }
   }

  useEffect(() => {
    console.warn(users);
  }, [trackState])
  useEffect(() => {
    const clientStats = client.getRTCStats();
  
    const clientStatsList = [
      { description: "Number of users in channel", value: clientStats.UserCount, unit: "" },
      { description: "Duration in channel", value: clientStats.Duration, unit: "s" },
      { description: "Bit rate receiving", value: clientStats.RecvBitrate, unit: "bps" },
      { description: "Bit rate being sent", value: clientStats.SendBitrate, unit: "bps" },
      { description: "Total bytes received", value: clientStats.RecvBytes, unit: "bytes" },
      { description: "Total bytes sent", value: clientStats.SendBytes, unit: "bytes" },
      { description: "Outgoing available bandwidth", value: clientStats.OutgoingAvailableBandwidth.toFixed(3), unit: "kbps" },
      { description: "RTT from SDK to SD-RTN access node", value: clientStats.RTT, unit: "ms" },
    ]
    console.warn(clientStatsList);
    setStats(clientStatsList)
    const localStats = { video: client.getLocalVideoStats(), audio: client.getLocalAudioStats() };
    const localStatsList = [
      { description: "Send audio bit rate", value: localStats.audio.sendBitrate, unit: "bps" },
      { description: "Total audio bytes sent", value: localStats.audio.sendBytes, unit: "bytes" },
      { description: "Total audio packets sent", value: localStats.audio.sendPackets, unit: "" },
      { description: "Total audio packets loss", value: localStats.audio.sendPacketsLost, unit: "" },
      { description: "Video capture resolution height", value: localStats.video.captureResolutionHeight, unit: "" },
      { description: "Video capture resolution width", value: localStats.video.captureResolutionWidth, unit: "" },
      { description: "Video send resolution height", value: localStats.video.sendResolutionHeight, unit: "" },
      { description: "Video send resolution width", value: localStats.video.sendResolutionWidth, unit: "" },
      { description: "video encode delay", value: Number(localStats.video.encodeDelay).toFixed(2), unit: "ms" },
      { description: "Send video bit rate", value: localStats.video.sendBitrate, unit: "bps" },
      { description: "Total video bytes sent", value: localStats.video.sendBytes, unit: "bytes" },
      { description: "Total video packets sent", value: localStats.video.sendPackets, unit: "" },
      { description: "Total video packets loss", value: localStats.video.sendPacketsLost, unit: "" },
      { description: "Video duration", value: localStats.video.totalDuration, unit: "s" },
      { description: "Total video freeze time", value: localStats.video.totalFreezeTime, unit: "s" },
    ];
    //console.warn(localStatsList);
    console.warn(client.getRemoteNetworkQuality());
    setLocalStats(localStatsList)
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
  }, [isPopoverOpen, videoConfigs.length]);

  const tuneVolume = (op) => {
    let val = volume;
    (op === '+') ? setVolume(val + 25) : setVolume(val - 25);
    tracks[0].setVolume(volume);
    console.warn(op);
    console.warn(volume);
  }
  useEffect(() => {
    console.warn(volume);
  }, [volume]);

  return (

    <>
      <Participants users={users} />
      <section id="stream__container">
        <div id="big">

        </div>
        <div style={{display:'flex'}} id="controller">
         
          <button className="controls" style={{ color: 'white', backgroundColor: camera ? '#3F8CFE' : '#F12646', marginLeft: '0%'}} onClick={() => {

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
            <i class="fa-solid fa-desktop"></i>
          </button>
          <button className="controls" style={{ backgroundColor: '#F12646' }} control="true" id="leave-btn" onClick={async () => {
            await client.leave();
            client.removeAllListeners();
            tracks[0].close();
            tracks[1].close();
            client.leave();
            dispatch(
              login({
                name: '',
                room: '',
                loggedIn: false,
              }),
            )
            if(sessionStorage.getItem('authTokens')!==null)
            {
              logoutUser();
            }
            //setInCall(false);
            navigate(-2);

          }} >
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
          <button className="controls" onClick={openAIDenoiser}style={{backgroundColor:'#3F8CFE',width:'fit-content'}} id="openAiDenosier" >Open</button>
          <button className="controls" onClick={enableAiDenoiser}style={{backgroundColor:'#3F8CFE',width:'fit-content'}} id="enableAiDenosier">enable</button>
          <div style={{ display: 'inline', marginLeft: '30px' }}>
            <button className="controls" style={{ backgroundColor: '#3F8CFE', color: 'white', marginLeft: '15px'  }} onClick={() => { volume<100 && tuneVolume('+') }}> <i className="fa-solid fa-volume-high"></i> </button>
            <span style={{ fontSize: '15px', transition: '1ms ease-in' }}>{volume + 25}</span>
            <button className="controls" style={{ backgroundColor: '#3F8CFE', color: 'white', marginRight: '15px' }} onClick={() => { volume>-1 &&  tuneVolume('-') }} > <i className="fa-solid fa-volume-low"></i> </button>

         
          <span style={{fontSize:'10px'}}>Video Config</span>
          <select id="config" name="configs" value={selectedConfig} onChange={(e) => {
            console.warn(e.target.value);
            setSelectedConfig(e.target.value);
            tracks[1].setEncoderConfiguration(e.target.value);
          }}>
            {videoConfigs.map(config =>
              <option key={config.label} value={config.label}>{config.label}</option>
            )};
          </select>
         
          </div>
        </div>
        {/* <div id="stream__box" >
          <div id="streams__container">
         
          </div>
          
        </div> */}

        <div id="stream__container">     
        <div className="Room__Name"><h1>{x.room}</h1></div>
          <div  style={{marginLeft:'0vw'}} className={`grid-container`} >
   
            <div  style={{position:'relative',marginTop:'2vh',marginLeft:'1vw'}}onClick={() => {
              isFull ? setFull(false) : setFull(true)
            }
            } className={`${isFull ? 'full' : 'mid'}-screen`} id={`user`}>
             <span style={{position:'absolute',bottom:'2%',right:'2%',fontSize:'small',zIndex:999,backgroundColor:'rgba(0,0,0,0.7)',padding:'5px',borderRadius:'5px'}}>{x.name}</span>
              <AgoraVideoPlayer className='vid' videoTrack={trackState} style={{  borderRadius: '10px', height: '100%', width: '100%', borderWidth: '10px' }} />

            </div>

            
            {/* <div onClick={(e) => {
              isFull2 ? setFull2(false) : setFull2(true)
              console.warn(e.target.id);
              setSecond(e.target.id);
            } 
            } className={`${isFull2 && second==="videos6"  ? isFull?'full2':'full' :'mid'}-screen`} style={{ borderRadius:'10px',margin: '15px', backgroundPosition:'center'  ,backgroundImage:`url(${image2})`}} id="videos6">

            </div>
            <div  onClick={(e) => {
              isFull2 ? setFull2(false) : setFull2(true)
              console.warn(e.target.id);
              setSecond(e.target.id);
            } 
            } className={`${isFull2 && second==="videos7"  ? isFull?'full2':'full' :'mid'}-screen`}
            style={{ borderRadius:'10px',margin: '15px', backgroundPosition:'center'  ,backgroundImage:`url(${image3})`}} id="videos7">

            </div>
            <div onClick={(e) => {
              isFull2 ? setFull2(false) : setFull2(true)
              console.warn(e.target.id);
              setSecond(e.target.id);
            } 
            } className={`${isFull2 && second==="videos8"  ? isFull?'full2':'full' :'mid'}-screen`}
             style={{ borderRadius:'10px',margin: '15px', backgroundPosition:'center'  ,backgroundImage:`url(${image3})`}} id="videos8">

            </div> */}

            
              {users.length > 0 &&
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
                })}
         
          
          </div>
        </div>

      </section>
    </>
  )
}

export default Display