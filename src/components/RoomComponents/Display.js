import React from 'react'
import '../../Styles/room.css'
import { useState, useEffect } from 'react';
import { config, useClient, useMicrophoneAndCameraTracks } from "./../../settings.js";
import { AgoraVideoPlayer, createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
function Display(props) {
  let { setInCall } = props;
  const { users, tracks } = props;
  useEffect(()=>{
    console.warn(users);
  })
  return (

    <>
      <section id="stream__container">
        <div >
          <div>
            <div style={{height:'60vh',width:'70vw'}} id="videos">
              <AgoraVideoPlayer className='vid' videoTrack={tracks[1]} style={{ height: '100%', width: '100%' }} />
              {users.length > 0 &&
                users.map((user) => {
                  {console.error(users.length)}
                  if (user.videoTrack) {
                    return (
                      <div id="stream__box" style={{height:'20vh',width:'20vw'}}>
                      <AgoraVideoPlayer className='vid' videoTrack={user.videoTrack} style={{ height: '95%', width: '95%' }} key={user.uid} />
                      </div>
                    );
                  } else return null;
                })}
            </div>
          </div>
        </div>
        <button style={{ marginLeft: '40%' }} id="mic-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 4h-3v-1h3v1zm10.93 0l.812 1.219c.743 1.115 1.987 1.781 3.328 1.781h1.93v13h-20v-13h3.93c1.341 0 2.585-.666 3.328-1.781l.812-1.219h5.86zm1.07-2h-8l-1.406 2.109c-.371.557-.995.891-1.664.891h-5.93v17h24v-17h-3.93c-.669 0-1.293-.334-1.664-.891l-1.406-2.109zm-11 8c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm7 0c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z" /></svg>

        </button>
        <button id="mic-btn" className="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z" /></svg>
        </button>
        <button id="mic-btn" >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 1v17h24v-17h-24zm22 15h-20v-13h20v13zm-6.599 4l2.599 3h-12l2.599-3h6.802z" /></svg>
        </button>
        <button id="mic-btn" >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 10v-5l8 7-8 7v-5h-8v-4h8zm-16-8v20h14v-2h-12v-16h12v-2h-14z" /></svg>
        </button>
        <div id="streams__container"></div>
        <div className="">

        </div>
      </section>
    </>
  )
}

export default Display