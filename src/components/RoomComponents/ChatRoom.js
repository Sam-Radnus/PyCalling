
import React, { useState } from 'react'
import { createChannel, createClient, RtmMessage } from 'agora-rtm-react'
import { useClient,useChannel} from '../../settings'
function ChatRoom() {
    const client=useClient();
    const testChannel=createChannel(client);
    const [texts,setTexts]=useState([])
    const [uid,setUid]=useState('')
    const [textInput,setTextInput]=useState('')
    const [isLoggedIn,setLoggedIn]=useState(false);
    
    const sendMsg=async(text)=>{
        console.warn(text);
        let message=await client.createMessage({text,mediaType:'FILE'})
        console.warn(message);
        await testChannel.sendMessage(message)
        setTexts((previous)=>{
            return [...previous,{msg:{text},uid}]
        })
        console.warn(texts);
    }
  return (
    <section id="messages__container">

    <div id="messages">
        <div className="message__wrapper">
            <div className="message__body__bot">
                <strong className="message__author__bot">🤖 PyCardis Bot</strong>
                <p className="message__text__bot">Welcome to the room, Don't be shy, say hello!</p>
            </div>
        </div>

        <div className="message__wrapper">
            <div className="message__body__bot">
                <strong className="message__author__bot">🤖 PyCardis Bot</strong>
                <p className="message__text__bot">Dennis Ivy just entered the room!</p>
            </div>
        </div>

        <div className="message__wrapper">
            <div className="message__body">
                <strong className="message__author">Dennis Ivy</strong>
                <p className="message__text">Does anyone know when he will be back?</p>
            </div>
        </div>

       
    </div>

    <form id="message__form" onSubmit={(e)=>{
        e.preventDefault();
        sendMsg(textInput)}}>
        <input type="text" name="message" onChange={(e)=>{
            
            setTextInput(e.target.value);
        }} placeholder="Send a message...." />
    </form>

</section>
  )
}

export default ChatRoom