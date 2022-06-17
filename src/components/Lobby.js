import React, { useEffect } from 'react'
import '../Styles/lobby.css'
import {Link ,Navigate,useNavigate,useLocation} from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux/es/exports';
import { selectUser } from './../features/userSlice';
import { useState } from 'react';
import { login } from "./../features/userSlice";
import Room from './Room';
function Lobby() {
    let navigate=useNavigate();
    let [name,setName]=useState('');
    let [room,setRoom]=useState('');
    const dispatch=useDispatch();
    const x=useSelector(selectUser);
    useEffect(()=>{
       
            try{
            console.log(x);
            }
            catch(error)
            {
              console.error(error);
            }
           
    })
  return (
    <div>
         

    <main id="room__lobby__container">
        <div id="form__container">
             <div id="form__container__header">
                 <p>👋 Create or Join Room</p>
             </div>
 
 
            <form id="lobby__form">
 
                 <div className="form__field__wrapper">
                     <label>Your Name</label>
                     <input type="text"  name="name" onChange={(e)=>{
                        setName(e.target.value);
                     }} required placeholder="Enter your display name..." />
                 </div>
 
                 <div className="form__field__wrapper">
                     <label>Room Name</label>
                     <input type="text"  name="room" onChange={(e)=>{
                        setRoom(e.target.value);
                     }} required placeholder="Enter room name..." />
                 </div>
 
                 <div className="form__field__wrapper">
                     <button onClick={(e)=>{
                        if(name.length!==0 && room.length!==0){
                        e.preventDefault();
                        console.log("name:",name)
                        console.log("room:",room)       
                        navigate(`/Room/${room}`)       
                        dispatch(
                            login({
                                name:name,
                                room:room,
                                loggedIn:true,
                            })
                        )
                        sessionStorage.setItem('name',name);
                        sessionStorage.setItem('room',room);
                        sessionStorage.setItem('loggedIn',true);
                        } 
                        return <Room />
                   }} type="submit">Go to Room 
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg>
                    </button>
                 </div>
            </form>
        </div>
     </main>
    </div>
  )
}

export default Lobby