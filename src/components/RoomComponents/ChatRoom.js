
import React, { useEffect, useState } from 'react'
import { createChannel, createClient, RtmMessage } from 'agora-rtm-react'
import '../../Styles/room.css'
const useClient = createClient("9e4b87cc837448969b97b4301e2aca92");
const USER_ID = Math.floor(Math.random() * 1000000001);
const useChannel = createChannel('TV')
function ChatRoom(props) {
    const client=useClient();
    const testChannel=useChannel(client);
    const [texts,setTexts]=useState([]);
    const [uid,setUid]=useState('');
    const [hide,setHide]=useState(false);
    const [textInput,setTextInput]=useState('')
    const [isLoggedIn,setLoggedIn]=useState(false);
    const users=props.users;
    const uid2=props.uid;
    useEffect(() => {
        if (textInput) setTexts([...texts, textInput]);
      }, [texts.length]);    
    const sendMsg=async(text,hide)=>{
    
        
        setUid(users[0]);
        await client.setLocalUserAttributes({user:hide?'user':users[0]});
        let message=client.createMessage({text,uid:USER_ID.toString(),messageType:'TEXT'})
        console.warn(message);
        console.warn(users);
        await testChannel.sendMessage(message)
        setTexts((previous) => {
            return [...previous, { msg: { text }, uid:USER_ID.toString() }]
         })
        setTextInput('');   
      
    }
    let login=async(val)=>{
        let val2=val.toString();
        console.warn(isLoggedIn);

        await client.login({uid:USER_ID.toString()});
      
        await testChannel.join();
        await client.setLocalUserAttributes({user:users[0]});
        client.on('ConnectionStateChanged', async (state, reason) => {
            console.log('ConnectionStateChanged', state, reason)
          })
          testChannel.on('ChannelMessage',async (msg, uid) => {
            const user = await client.getUserAttributes(uid);
           
            setTexts((previous) => {
              return [...previous, { msg, uid:user }]
            })
          })
          testChannel.on('MemberJoined', (memberId) => {
            console.warn('New Member: ', memberId)
          })
          setLoggedIn(true)
         
    }
    let logout=async()=>{
        await testChannel.leave();
        await client.logout()
        testChannel.removeAllListeners()
        setLoggedIn(false);
    }
    useEffect(()=>{
        login('100');
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
               
                <strong className="message__author">{text.uid.user?text.uid.user:'you'}</strong>
                <p className="message__text">{text.msg['text']}</p>
            </div>
        </div>
        )}
       
    </div>

    <form id="message__form" onSubmit={(e)=>{
        e.preventDefault();
        }}>
        <input type="text" name="message" onChange={(e)=>{
            setTextInput(e.target.value);
        }} placeholder="Send a message...." />
        <button className="send" onClick={(e)=>{
             e.preventDefault();
             
             sendMsg(textInput,false);
        }}style={{marginTop:'5px'}}><i className="fa-solid fa-message"></i></button>
        <button className="send" onClick={(e)=>{
             e.preventDefault();
             sendMsg(textInput,true);
        }}style={{marginTop:'5px',marginLeft:'5px'}}><i class="fa-solid fa-comment-slash"></i></button>
    </form>
    

</section>
  )
}

export default ChatRoom