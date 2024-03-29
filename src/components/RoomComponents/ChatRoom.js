import React, { useEffect, useState } from 'react'
import { createChannel } from 'agora-rtm-react'
import '../../Styles/room.css'
import AgoraRTM from 'agora-rtm-sdk'

import {  useSelector } from "react-redux";


import { useNavigate } from 'react-router-dom';
const USER_ID = Math.floor(Math.random() * 1000000001);
let type = 'bot';
const useChannel = createChannel('TV')
const client = AgoraRTM.createInstance(process.env.REACT_APP_AGORA_APP_ID);

function ChatRoom(props) {

    const testChannel = useChannel(client);
    const [texts, setTexts] = useState([]);
    const [uid, setUid] = useState('');
    //const [hide, setHide] = useState(false);
    const [disable, setDisable] = useState(true);
    const [textInput, setTextInput] = useState('')
    const [isLoggedIn, setLoggedIn] = useState(false);
    const users = props.users;
    
    const tracks = props.tracks;
    const clientRTC = props.clientRTC;
    const navigate = useNavigate();
   // let uid2 = props.uid;
    let { disolve } = props;
    const state=useSelector(state=>state.user)
    const {loading,userInfo}=state;
    const sendMsg = async (text, hide) => {
        console.log(disolve);
        setUid(users[0]);
        await client.setLocalUserAttributes({ user: hide ? 'user' : users[0] });
        let message = client.createMessage({ text, uid: USER_ID.toString(), messageType: 'TEXT' })
        // console.warn(message);
        // console.warn(users);
        await testChannel.sendMessage(message)
        setTexts((previous) => {
            return [...previous, { msg: { text }, uid: USER_ID.toString() }]
        })
        setTextInput('');
    }

    let login = async (val) => {
        console.warn(userInfo.isAdmin);
        await client.login({ uid: USER_ID.toString() });
        await testChannel.join();
        console.warn(client);
        //await client.setLocalUserAttributes({user:users[0]});
        //console.warn(users);


        client.on('ConnectionStateChanged', async (state, reason) => {
            console.log('ConnectionStateChanged', state, reason)

        })
        testChannel.on('ChannelMessage', async (msg, uid) => {

            const user = await client.getUserAttributes(uid);

            console.warn(msg);
            if (msg.text.toString().substring(0, 7) === 'Action:') {
                //console.warn('Action Taken');
                //console.warn(msg.text.substring(7, 13));
                //console.warn(msg.text.substring(20));
                if (msg.text.substring(7, 13) === "Kicked" && msg.text.substring(20) === users[0]) {
                    await tracks[0].close();
                    await tracks[1].close();
                    await clientRTC.leave();
                    await logout();
                    navigate('/Lobby');

                }
                if (msg.text.substring(7, 13) === "Letter" && msg.text.substring(20) === users[0]) {
                    setDisable(prev => !prev);
                }
                if (msg.text.substring(7, 13) === "Delete" && msg.text.substring(20) === "all") {
                    await tracks[0].close();
                    await tracks[1].close();
                    await clientRTC.leave();
                    await logout();
                    navigate('/Lobby');
                }
            }
            else {
                console.warn(users[0] === msg.text);

                console.warn(user);
                setTexts((previous) => {
                    return [...previous, { msg, uid: user, type: type }]
                })
            }
        })

        client.on('MessageFromPeer', function (message, peerId) {
            console.warn(message, peerId);
            console.warn('message received');
        })
        testChannel.on('MemberJoined', async (memberId) => {
            

        })
        setLoggedIn(true)

    }
    let logout = async () => {
        await testChannel.leave();
        await client.logout();
        console.warn("removed");
        testChannel.removeAllListeners()
        setLoggedIn(false);
    }
    const disolveRoom = async () => {
        if(isLoggedIn){
        let text = "Action:Delete->User:all";
        console.warn(text);
        let message = client.createMessage({ text, uid: USER_ID.toString(), messageType: 'TEXT' })
        // console.warn(message);
        // console.warn(users);

        await testChannel.sendMessage(message);

        console.warn(message);
        setTexts((previous) => {
            return [...previous, { msg: { text }, uid: USER_ID.toString() }]
        })
        navigate('/Lobby');
        }
    }
/*    const toggleVideo = async (uid) => {
        var peerId = uid.toString();
        console.warn(peerId);
        console.warn("Remote Video Button Pressed");
        let peerMessage = "video";
        await client.sendMessageToPeer(
            { text: peerMessage },
            uid,
        ).then(sendResult => {
            if (sendResult.hasPeerReceived) {
                console.warn(sendResult.hasPeerReceived);
                //document.getElementById("log").appendChild(document.createElement('div')).append("Message has been received by: " + peerId + " Message: " + peerMessage)
            } else {
                console.warn(sendResult.hasPeerReceived);
                //document.getElementById("log").appendChild(document.createElement('div')).append("Message sent to: " + peerId + " Message: " + peerMessage)
            }
        })
    }
    */
    const action = async (uid, action) => {
        let text = "Action:" + action + "->User:" + uid;
        console.warn(text);
        let message = client.createMessage({ text, uid: USER_ID.toString(), messageType: 'TEXT' })
        // console.warn(message);
        // console.warn(users);

        await testChannel.sendMessage(message);
        console.warn(message);
        setTexts((previous) => {
            return [...previous, { msg: { text }, uid: USER_ID.toString() }]
        })
    }
    useEffect(() => {
        login('100');
    }, []);


    useEffect(() => {
        console.warn(props.disolve);
        disolveRoom();
    }, [props.disolve]);
    return (
        <>
     
            <section id="members__container">

                <div id="members__header">
                    <p>Participants</p>
                    <strong id="members__count">{users.length}</strong>
                </div>

                <div id="member__list">
                    <div className="member__wrapper" id="member__1__wrapper">
                        <div style={{ display: 'flex' }}>

                            <p style={{ marginLeft: '45px' }} className="member_name">   {users[0]}
                             
                            </p>
                        </div>


                    </div>
                    {users.slice(1, 10).map(user => (
                        <div key={user.uid} style={{display:'grid',paddingLeft:'15px'}} className="member__wrapper" id="member__1__wrapper">


                            <p style={{ marginLeft: '30px' }} className="member_name">{user.uid}</p>

                             <div style={{ margin:'5px 0px',display: `${userInfo.isAdmin  ? 'flex' : 'none'}` }}>
                                <button onClick={() => {
                                    action(user.uid, "Kicked");
                                }}><i className="fa-solid fa-circle-xmark"></i></button>

                                <button onClick={() => {
                                    action(user.uid, "Letter");
                                }}><i className="fa-solid fa-comment-slash"></i></button>

                                 <button onClick={() => {
                                    console.log('Info');
                                }}><i className="fa-solid fa-circle-info"></i></button>
                                  <button onClick={() => {
                                    console.log('Info');
                                }}><i className="fa-solid fa-download"></i></button>
                            </div>
                         

                        </div>
                    ))
                    }

                </div>

            </section>
            <section id="messages__container">

                <div id="messages">
                    {/* <div className="message__wrapper">
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
        </div> */}

                    {texts.map((text, i) =>{
                        if (text.msg['text'].startsWith('Action:'))
                           return null
                        else
                        return (
                        <div key={i} style={{ color: 'white', marginLeft: `${text.uid.user ? '1em' : '12em'}` }} onClick={(e) => {
                        }} className="message__wrapper">
                            <div style={{ color: 'white', backgroundColor: `${text.uid.user ? '#252D33' : '#51B66D'}` }} className={`message__body`}>
                                <strong style={{ color: 'white' }} className="message__author">{text.uid.user ? text.uid.user : 'you'}</strong>

                                <p className={`message__text${text.type === 'bot' ? '_bot' : ''}`}>{text.msg['text']}</p>
                            </div>
                        </div>
                    )})
                    }
                </div> 


                <form id="message__form" onSubmit={(e) => {
                    
                    e.preventDefault();
                    
                }}>
                    {disable ? <>
                        <input type="text" className="form-control" name="message" onChange={(e) => {
                            setTextInput(e.target.value);
                        }} required placeholder="Send a message...." />

                        <button className="send"  disabled={!textInput} onClick={(e) => {
                            e.preventDefault();
                            sendMsg(textInput, false);
                        }} style={{ marginTop: '5px' }}><i className="fa-solid fa-message"></i></button>
                        <button className="send" disabled={!textInput} id="second" onClick={(e) => {
                            e.preventDefault();
                            sendMsg(textInput, true);
                        }} style={{ marginTop: '5px', marginLeft: '5px' }}><i className="fa-solid fa-comment-slash"></i></button>
                    </> : <p>The Host has Disabled your Messaging Privilege</p>
                    }
                </form>

            </section>
        </>
    )
}

export default ChatRoom