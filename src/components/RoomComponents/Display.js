import React from 'react'
import '../../Styles/room.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { config, useClient, useMicrophoneAndCameraTracks } from "./../../settings.js";
import AgoraRTC, { AgoraVideoPlayer, createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import { useSelector } from "react-redux"
import Participants from './Participants';
import { login, selectUser } from "./../../features/userSlice.js";
import { Popover } from 'react-tiny-popover'
import image1 from './adidas.jpg';
import image2 from './bored.png';
import image3 from './unnamed-2.webp';
import image4 from './unnamed5.png';
import {AIDenoiserExtension} from "agora-extension-ai-denoiser";
function Display(props) {


  let localScreenTracks = [];
  const x = useSelector(selectUser);
  const dispatch = useDispatch();
  const { users, tracks } = props;
  const [denoiser,setDenoiser] = useState(null);
  let processor=null;
  const [processorEnable,setProcessorEnable]=useState(true);
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
  const pipeAIDenosier = (audioTrack, processor) => {
    audioTrack.pipe(processor).pipe(audioTrack.processorDestination);
  }
   const openAIDenoiser=async(e)=>{
       e.preventDefault();
       denoiser=denoiser||((()=>{
          const denoiser = new AIDenoiserExtension({assetsPath:'./external'});
          AgoraRTC.registerExtensions([denoiser]);
          denoiser.onloaderror=(e)=>{
            console.error(e);
            processor=null;
          }
          return denoiser;
   })())
        processor=processor||((()=>{
          let processor=denoiser.createProcessor();
          processor.onoverload=async()=>{
             console.log("overload!!!");
             try{
              await processor.disable();
              processor=true;
             }
             catch(error)
             {
              console.error(error);
             }
             finally{
                 console.log('enabled');
             }
          }
          return processor;
        })());
        pipeAIDenosier(tracks[0],processor);
    
   }
   const enableAiDenoiser=async(e)=>{
    e.preventDefault();
    if(processorEnable)
    {
      try{
        await processor.enable();
        processorEnable=false;
      }
      catch(e){
        console.error(e);
      }
      finally{
        
      }
    }else{
       try{
        processor.disable();
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
          <div style={{marginTop:'5px'}}>
          {/* <Popover
            isOpen={isPopoverOpen}
            positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
            onClickOutside={() => setIsPopoverOpen(false)}
            content={<div style={{ position: 'absolute', backgroundColor: '#09041B', top: '25%', left: '0%', paddingLeft: '25px', borderRadius: '5px', transition: '2s ease-in-out' }}>

              {stats.map((stat) =>
                <p style={{ fontSize: '15px' }}>
                  <small >{stat.description}</small><span>:{stat.value} {stat.unit}</span>
                </p>
              )}
            </div>}
          >
            <button  class="local" onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
              Get User Stats
            </button>
          </Popover>
          <Popover
            isOpen={isPopoverOpen2}
            positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
            onClickOutside={() => setIsPopoverOpen2(false)}
            content={<div style={{ position: 'absolute', backgroundColor: '#09041B', top: '25%', left: '0%', width: '10vw', paddingLeft: '25px', borderRadius: '5px', transition: '2s ease-in-out' }}>

              {localStats.map((stat) =>
                <p style={{ fontSize: '15px' }}>
                  <small >{stat.description}</small><span>:{stat.value} {stat.unit}</span>
                </p>
              )}
            </div>}
          >
            <button class="local" style={{marginLeft:'0px'}} onClick={() => setIsPopoverOpen2(!isPopoverOpen2)}>
              Get Local Stats
            </button>
          </Popover> */}
          </div>
          <button className="controls" style={{ color: 'white', backgroundColor: camera ? 'blue' : 'red', marginLeft: '0%'}} onClick={() => {

            console.warn(camera);
            tracks[1].muted ? tracks[1].setMuted(false) : tracks[1].setMuted(true);

            setCamera(tracks[1].muted);

          }} >

            <i className="fa-solid fa-camera"></i>
          </button>


          <button style={{ color: 'white', backgroundColor: mic ? 'blue' : 'red' }} onClick={() => {
            tracks[0].muted ? tracks[0].setMuted(false) : tracks[0].setMuted(true);
            tracks[1].setEncoderConfiguration({ width: 200, height: 640 });
            setMic(tracks[0].muted)
            console.warn(mic);
          }} className="controls">
            <i className={`fa-solid fa-microphone-lines${mic ? '-slash' : ''}`}></i>
          </button>
          <button className="controls" style={{ color: 'white', backgroundColor: screenShare ? 'red' : 'blue' }} id="screen-btn" onClick={screenSharing} >
            <i class="fa-solid fa-desktop"></i>
          </button>
          <button className="controls" style={{ backgroundColor: 'red' }} control="true" id="leave-btn" onClick={async () => {
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
            //setInCall(false);
            navigate('/');

          }} >
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
          <button className="controls" onClick={openAIDenoiser}style={{backgroundColor:'blue',width:'fit-content'}} id="openAiDenosier" >Open</button>
          <button className="controls" onClick={enableAiDenoiser}style={{backgroundColor:'blue',width:'fit-content'}} id="enableAiDenosier">enable</button>
          <div style={{ display: 'inline', marginLeft: '30px' }}>
            <button className="controls" style={{ backgroundColor: 'blue', color: 'white', marginLeft: '15px'  }} onClick={() => { volume<100 && tuneVolume('+') }}> <i className="fa-solid fa-volume-high"></i> </button>
            <span style={{ fontSize: '15px', transition: '1ms ease-in' }}>{volume + 25}</span>
            <button className="controls" style={{ backgroundColor: 'blue', color: 'white', marginRight: '15px' }} onClick={() => { volume>-1 &&  tuneVolume('-') }} > <i className="fa-solid fa-volume-low"></i> </button>

         
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
          <div style={{marginLeft:'0vw'}} className="grid-container" >

            <div onClick={() => {
              isFull ? setFull(false) : setFull(true)
            }
            } className={`${isFull ? 'full' : 'mid'}-screen`} id={`user`}>
              <AgoraVideoPlayer className='vid' videoTrack={trackState} style={{ borderStyle: 'solid', borderRadius: '10px', borderColor: 'blue', height: '100%', width: '100%', borderWidth: '10px' }} />

            </div>

            <div onClick={(e) => {
              isFull2 ? setFull2(false) : setFull2(true) 
              console.warn(e.target.id);
              setSecond(e.target.id);
            } 
            } className={`${isFull2 && second==="videos1" ? isFull?'full2':'full' :'mid'}-screen`}
             style={{borderRadius:'10px', margin: '15px',backgroundPosition:'center' ,backgroundImage:`url(${image1})` }} id="videos1">
              
            </div>
            <div onClick={(e) => {
              isFull2 ? setFull2(false) : setFull2(true)
              console.warn(e.target.id);
              setSecond(e.target.id);

            } 
            } className={`${isFull2 && second==="videos2"  ? isFull?'full2':'full' :'mid'}-screen`} style={{borderRadius:'10px', margin: '15px',backgroundPosition:'center' ,backgroundImage:`url(${image2})` }} id="videos2">

            </div>
            <div onClick={(e) => {
              isFull2 ? setFull2(false) : setFull2(true)
              console.warn(e.target.id);
              setSecond(e.target.id);
            } 
            } className={`${isFull2 && second==="videos3"  ? isFull?'full2':'full' :'mid'}-screen`} style={{borderRadius:'10px', margin: '15px',  backgroundPosition:'center'  ,backgroundImage:`url(${image3})`}} id="videos3">

            </div>
            <div onClick={(e) => {
              isFull2 ? setFull2(false) : setFull2(true)
              console.warn(e.target.id);
              setSecond(e.target.id);
            } 
            } className={`${isFull2 && second==="videos4"  ? isFull?'full2':'full' :'mid'}-screen`} style={{ borderRadius:'10px',margin: '15px',backgroundPosition:'center' , backgroundImage:`url(${image4})` }} id="videos4">

            </div>
            <div onClick={(e) => {
              isFull2 ? setFull2(false) : setFull2(true)
              console.warn(e.target.id);
              setSecond(e.target.id);
            } 
            } className={`${isFull2 && second==="videos5"  ? isFull?'full2':'full' :'mid'}-screen`}
            style={{ borderRadius:'10px',margin: '15px',  backgroundPosition:'center' ,backgroundImage:`url(${image1})` }} id="videos5">

            </div>
            <div onClick={(e) => {
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

            </div>

            <div style={{ margin: '15px', height: '20vh', width: '20vw' }} id="videos">
              {users.length > 0 &&
                users.map((user) => {
                  if (user.videoTrack) {

                    return (
                      <AgoraVideoPlayer className='vid' videoTrack={user.videoTrack} style={{ borderStyle: 'solid', borderRadius: '5px', borderColor: 'red', height: '100%', width: '100%', borderWidth: '10px' }} key={user.uid} />
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