
import React, { useEffect, useState } from 'react'
import { createChannel, createClient, RtmChannel, RtmMessage } from 'agora-rtm-react'
import '../../Styles/room.css'
import AgoraRTM from 'agora-rtm-sdk'
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout, selectUser } from "./../../features/userSlice";
const useClient = createClient("9e4b87cc837448969b97b4301e2aca92");
const USER_ID = Math.floor(Math.random() * 1000000001);
let type='bot';
const useChannel = createChannel('TV')
const client=AgoraRTM.createInstance("9e4b87cc837448969b97b4301e2aca92",{enableLogUpload:false});
function ChatRoom(props) {
    
    const testChannel=useChannel(client);
    const [texts,setTexts]=useState([]);
    const [uid,setUid]=useState('');
    const [hide,setHide]=useState(false);
    const [textInput,setTextInput]=useState('')
    const [isLoggedIn,setLoggedIn]=useState(false);
    const users=props.users;
    const clientRTM = AgoraRTM.createInstance("9e4b87cc837448969b97b4301e2aca92");
    const cust = useSelector(selectUser);
    let uid2=props.uid;
     
    const sendMsg=async(text,hide)=>{
        setUid(users[0]);
        await client.setLocalUserAttributes({user:hide?'user':users[0]});
        let message=client.createMessage({text,uid:USER_ID.toString(),messageType:'TEXT'})
       // console.warn(message);
       // console.warn(users);
        await testChannel.sendMessage(message)
        setTexts((previous) => {
            return [...previous, { msg: { text } ,uid:USER_ID.toString() }]
         })
        setTextInput('');   
    }
  
    let login=async(val)=>{
        
        console.warn(isLoggedIn);
        console.warn(cust.name);
        await client.login({uid:USER_ID.toString()});
        await testChannel.join();
        //await client.setLocalUserAttributes({user:users[0]});
        //console.warn(users);
        
        
          client.on('ConnectionStateChanged', async (state, reason) => {
            console.log('ConnectionStateChanged', state, reason)
            
          })
          testChannel.on('ChannelMessage',async (msg, uid) => {

            const user = await client.getUserAttributes(uid);
            console.warn(user);     
             setTexts((previous) => {
              return [...previous, { msg, uid:user, type:type}]
            })
            
          })
          
          client.on('MessageFromPeer',function({
            text
          },peerId){
            console.log(peerId+"muted/Unmuted your"+text);
            if(text=="audio")
            {
              console.warn("audio")
            }
            else if(text=="video")
            {
                console.warn("video");
            }
          })
          testChannel.on('MemberJoined',async (memberId) => {
          //  console.warn('New Member: ', memberId)
           // console.warn(users);          
            // type='bot';
            // let text=`${cust.name} just joined the room,say hello!!!`;
            // let message=client.createMessage({text,uid:'PyCardis Bot',type:'bot',messageType:'TEXT'});
            // await testChannel.sendMessage(message);
            // setTexts((previous) => {
            //    return [...previous, { msg: { text },type:type,uid:'PyCardis Bot' }]
            // })
            // type='none';
            // console.warn(texts);
          })
          setLoggedIn(true)
         
    }
    let logout=async()=>{
        await testChannel.leave();
        await client.logout()
        testChannel.removeAllListeners()
        setLoggedIn(false);
    }
    const toggleVideo=async(uid)=>{
      var fullDiv=uid;
      console.warn("Remote Video Button Pressed");
      let peerMessage="video";
      client.sendMessageToPeer({
        text:peerMessage
      },uid,).then(sendResult=>{
        if(sendResult.hasPeerReceived)
        {
            console.warn(sendResult.hasPeerReceived);
            console.warn("Message has been received by:"+uid+"Message:"+peerMessage);
        }
        else{
           console.warn(sendResult.hasPeerReceived);
            console.warn("Message has been send To:"+uid+" Message:"+peerMessage);
        }
      })
}
    useEffect(()=>{
        login('100');
     },[]);
    
  return (
    <>

<section id="members__container">
      
      <div  id="members__header">
          <p>Participants</p>
          <strong id="members__count">{users.length}</strong>
      </div>
  
      <div id="member__list">
          <div  className="member__wrapper" id="member__1__wrapper">
              <span className="green__icon"></span>
              <p className="member_name">{users[0]}</p>
              
              
          </div>
          {users.slice(1,10).map(user=>(
            <div key={user.uid} className="member__wrapper" id="member__1__wrapper">
            <button class="remote" onClick={()=>{
                uid2=user.uid;
                console.log(user.uid)
                toggleVideo(user.uid)
            }}>mute</button>
            <p  className="member_name">{user.uid}</p>
        </div>
          ))
        }
  
      </div>
  
      </section>
    <section id="messages__container">

    <div id="messages">
        {/* <div className="message__wrapper">
            <div className="message__body__bot">
                <strong className="message__author__bot">???? PyCardis Bot</strong>
                <p className="message__text__bot">Welcome to the room, Don't be shy, say hello!</p>
            </div>
        </div>

        <div className="message__wrapper">
            <div className="message__body__bot">
                <strong className="message__author__bot">???? PyCardis Bot</strong>
                <p className="message__text__bot">Dennis Ivy just entered the room!</p>
            </div>
        </div> */}
       
        { texts.map((text,i)=>
        <div key={i}  onClick={(e)=>{
        }} className="message__wrapper">
            <div  style={{color:'white',backgroundColor:`${text.uid.user?'#252D33':'#51B66D'}`}} className={`message__body`}>
                <strong style={{color:'white'}} className="message__author">{text.uid.user?text.uid.user:'you'}</strong>
                
                <p   className={`message__text${text.type==='bot'?'_bot':''}`}>{text.msg['text']}</p>
            </div>
        </div>
        )}
        
    </div>

   
    <form id="message__form" onSubmit={(e)=>{
        e.preventDefault();
        }}>
        <input type="text"  name="message" onChange={(e)=>{
            setTextInput(e.target.value);
        }} placeholder="Send a message...." />
        <button className="send" onClick={(e)=>{
             e.preventDefault();
             
             sendMsg(textInput,false);
        }}style={{marginTop:'5px'}}><i className="fa-solid fa-message"></i></button>
        <button className="send" id="second" onClick={(e)=>{
             e.preventDefault();
             sendMsg(textInput,true);
        }}style={{marginTop:'5px',marginLeft:'5px'}}><i class="fa-solid fa-comment-slash"></i></button>
    </form>

</section>
</>
  )
}

export default ChatRoom