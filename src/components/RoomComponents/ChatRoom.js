
import React, { useEffect, useState } from 'react'
import { createChannel, createClient, RtmMessage } from 'agora-rtm-react'
const useClient = createClient("9e4b87cc837448969b97b4301e2aca92");
const USER_ID = Math.floor(Math.random() * 1000000001);
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
    
        console.warn(isLoggedIn);
        setUid(users[0]);
        let message=client.createMessage({text,user:uid,messageType:'TEXT'})
        console.warn(message);
        console.warn(users);
        await testChannel.sendMessage(message)
        setTexts((previous) => {
            return [...previous, { msg: { text }, uid }]
         })
        setTextInput('');   
        console.warn(texts);
    }
    let login=async(val)=>{
        let val2=val.toString();
        console.warn(isLoggedIn);

        await client.login({uid:USER_ID.toString()});
        console.warn(2);
        await testChannel.join();
        
        console.warn(3);
        client.on('ConnectionStateChanged', async (state, reason) => {
            console.log('ConnectionStateChanged', state, reason)
          })
          testChannel.on('ChannelMessage', (msg, uid) => {
            setTexts((previous) => {
              return [...previous, { msg, uid }]
            })
          })
          testChannel.on('MemberJoined', (memberId) => {
            console.log('New Member: ', memberId)
          })
          setLoggedIn(true)
          console.warn(4);
    }
    let logout=async()=>{
        await testChannel.leave();
        await client.logout()
        testChannel.removeAllListeners()
        setLoggedIn(false);
    }
    useEffect(()=>{
        console.warn(users);
        if(users.length>1)
        {
        login(users[users.length-1]._uintid);
        console.warn(users[users.length-1]._uintid);
        }
        else{
            login(users[0])
        }
     },[]);
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
                {console.warn(text)}
                <strong className="message__author">{text.uid}</strong>
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