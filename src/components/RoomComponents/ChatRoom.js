
import React, { useEffect, useState } from 'react'
import { createChannel, createClient, RtmMessage } from 'agora-rtm-react'
const useClient = createClient("9e4b87cc837448969b97b4301e2aca92");
const useChannel = createChannel('TV')
function ChatRoom(props) {
    const client=useClient();
    const testChannel=useChannel(client);
    const [texts,setTexts]=useState([]);
    const [uid,setUid]=useState('')
    const [textInput,setTextInput]=useState('')
    const [isLoggedIn,setLoggedIn]=useState(false);
    const users=props.users;
    const uid2=props.uid;
    const sendMsg=async(text)=>{
    
        console.warn(text);
        
        let message=client.createMessage({text,messageType:'TEXT'})
        console.warn(message);
        await testChannel.sendMessage(message)
        setTexts((previous) => {
            return [...previous, { msg: { text }, uid }]
         })
        setTextInput('');   
        console.warn(texts);
    }
    let login=async(val)=>{
       // let x=users[1]._uintid;
        console.warn(val);
        let val2=val.toString();
        await client.login({uid:val2});
        await testChannel.join();
        console.warn('hey');
        client.on('ConnectionStateChanged',async(state,reason)=>{
            console.warn('ConnectionStateChanged',state,reason)
        })
        testChannel.on('ChannelMessage',(msg,uid)=>{
            setTexts((previous)=>{
                return [...previous,{msg,uid}]
            })
        })
        testChannel.on('MemberJoined',(memberId)=>{
            console.warn('New Member:',memberId)
            
        })

        console.warn('hi');
        setLoggedIn(true);
    }
    let logout=async()=>{
        await testChannel.leave();
        await client.logout()
        testChannel.removeAllListeners()
        setLoggedIn(false);
    }
    
    useEffect(()=>{
        if(users.length!=0){
        console.warn(users);
        console.warn(Object.values(users).pop()._uintid);
        login(Object.values(users).pop()._uintid);
        
        }
     },[users]);
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
        { texts.map((text,i)=>
        <div key={i} className="message__wrapper">
            <div className="message__body">
                <strong className="message__author">User</strong>
                <p className="message__text">{text.msg['text']}</p>
            </div>
        </div>
        )}
       
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