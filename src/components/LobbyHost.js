import React from 'react'
import '../Styles/lobby.css'
import {useNavigate} from 'react-router-dom';
import { useDispatch } from "react-redux";

import { useState } from 'react';

import AuthContext from '../Context/AuthContext';
import Room from './Room';
import { useContext } from 'react';
const LobbyHost = () => {
  let navigate=useNavigate();
  let [name,setName]=useState('');
  let [password,setPassword]=useState('');
  let [room,setRoom]=useState('');
  const dispatch=useDispatch();
  const {loginUser}=useContext(AuthContext);
  return (
    <div style={{height:'100vh',backgroundColor:'#181E23'}}>
    <button className="back" onClick={()=>{
             navigate('/');
    }}><h1>go back</h1></button> 

    <main id="room__lobby__container">
        <div id="form__container">
             <div id="form__container__header">
                 <p>👋 Create or Join Room as a Host</p>
             </div>
 
 
            <form id="lobby__form">
 
                 <div className="form__field__wrapper">
                     <label>Host Name</label>
                     <input type="text"  name="name" onChange={(e)=>{
                        setName(e.target.value);
                     }} required placeholder="Enter your display name..." />
                 </div>
                 <div className="form__field__wrapper">
                     <label>Host Password</label>
                     <input type="text"  name="password" onChange={(e)=>{
                        setPassword(e.target.value);
                     }} required placeholder="Enter your Password..." />
                 </div>
 
                 <div className="form__field__wrapper">
                     <label>Room Name</label>
                     <input type="text"  name="room" onChange={(e)=>{
                        setRoom(e.target.value);
                     }} required placeholder="Enter room name..." />
                 </div>
 
                 <div className="form__field__wrapper">
                     <button onClick={async(e)=>{
                        if(name.length!==0 && room.length!==0){
                        e.preventDefault();
                        console.log("name:",name)
                        console.log("room:",room)    
                        //loginUser(name,password);
                        if(sessionStorage.getItem('authTokens')!==null){
                           navigate(`/Room/${room}`)       
                        //    dispatch(
                        //        login({
                        //            name:name,
                        //            room:room,
                        //            camera:true,
                        //            mic:true,
                        //            screen:false,
                        //            loggedIn:true,
                        //        })
                        //    )
                        }
                        sessionStorage.setItem('name',name);
                        sessionStorage.setItem('room',room);
                        sessionStorage.setItem('loggedIn',true);
                        } 
                        console.warn(room);
                        return <Room  room={room} />
                   }} type="submit">Login and Join
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg>
                    </button>
                 </div>
            </form>
        </div>
     </main>
    </div>
  )
}

export default LobbyHost