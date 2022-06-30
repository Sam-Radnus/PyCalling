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
function Display(props) {


  let localScreenTracks = [];
  const x = useSelector(selectUser);
  const dispatch = useDispatch();
  const { users, tracks } = props;
  const client = useClient();
  const [screenShare, setScreenShare] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPopoverOpen2, setIsPopoverOpen2] = useState(false);
  const navigate = useNavigate();
  const [trackState, setTrackState] = useState(tracks[1]);
  const [mic, setMic] = useState(true);
  const [stats, setStats] = useState([]);
  const [volume,setVolume]=useState(100);
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
  }, [isPopoverOpen]);
  const tuneVolume=(op)=>{
       let val=volume;
       (op==='+')?setVolume(val+25):setVolume(val-25);
       tracks[0].setVolume(volume);
       console.warn(op);
       console.warn(volume);
  }
  useEffect(()=>{
    console.warn(volume);
  },[volume]);
  return (

    <>
      <Participants users={users} />
      <section id="stream__container">
        <div id="big">

        </div>
        <div id="controller">
          <Popover
            isOpen={isPopoverOpen}
            positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
            onClickOutside={() => setIsPopoverOpen(false)}
            content={<div style={{ position: 'absolute', backgroundColor: '#262625', top: '25%', left: '0%', paddingLeft: '25px', borderRadius: '5px', transition: '2s ease-in-out' }}>

              {stats.map((stat) =>
                <p style={{ fontSize: '25px' }}>
                  <small >{stat.description}</small><span>:{stat.value} {stat.unit}</span>
                </p>
              )}
            </div>}
          >
            <button class="local" onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
              Get User Stats
            </button>
          </Popover>
          <Popover
            isOpen={isPopoverOpen2}
            positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
            onClickOutside={() => setIsPopoverOpen2(false)}
            content={<div style={{ position: 'absolute', backgroundColor: '#262625', top: '25%', left: '0%', width: '10vw', paddingLeft: '25px', borderRadius: '5px', transition: '2s ease-in-out' }}>

              {localStats.map((stat) =>
                <p style={{ fontSize: '25px' }}>
                  <small >{stat.description}</small><span>:{stat.value} {stat.unit}</span>
                </p>
              )}
            </div>}
          >
            <button class="local" onClick={() => setIsPopoverOpen2(!isPopoverOpen2)}>
              Get Local Stats
            </button>
          </Popover>
          <button className="controls" style={{ color: 'white', backgroundColor: camera ? 'blue' : 'red', marginLeft: '2%' }} onClick={() => {

            console.warn(camera);
            tracks[1].muted ? tracks[1].setMuted(false) : tracks[1].setMuted(true);

            setCamera(tracks[1].muted);

          }} >

            <i className="fa-solid fa-camera"></i>
          </button>
          <div  className="member__wrapper" id="member__1__wrapper">
            <p><button className="volume" onClick={()=>{tuneVolume('+')}}> <i className="fa-solid fa-volume-high"></i> </button></p>
            {volume+25}
            <p><button className="volume" onClick={()=>{tuneVolume('-')}} > <i className="fa-solid fa-volume-low"></i> </button></p>
            
        </div>
            
          <button style={{ color: 'white', backgroundColor: mic ? 'blue' : 'red' }} onClick={() => {
            tracks[0].muted ? tracks[0].setMuted(false) : tracks[0].setMuted(true);
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
        </div>
        {/* <div id="stream__box" >
          <div id="streams__container">
         
          </div>
          
        </div> */}

        <div id="stream__container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>

            <div style={{ margin: '15px', height: '20vh', width: '20vw' }} id={`user`}>
              <AgoraVideoPlayer className='vid' videoTrack={trackState} style={{ borderStyle: 'solid', borderRadius: '5px', borderColor: 'blue', height: '100%', width: '100%' }} />

            </div>
            <div style={{ margin: '15px', height: '20vh', width: '20vw' }} id="videos">
              {users.length > 0 &&
                users.map((user) => {
                  if (user.videoTrack) {

                    return (
                      <AgoraVideoPlayer className='vid' videoTrack={user.videoTrack} style={{ borderStyle: 'solid', borderRadius: '5px', borderColor: 'red', height: '100%', width: '100%' }} key={user.uid} />
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