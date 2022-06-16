import React from 'react'

function ChatRoom() {
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
                <p className="message__text">Does anyone know hen he will be back?</p>
            </div>
        </div>

        <div className="message__wrapper">
            <div className="message__body__bot">
                <strong className="message__author__bot">🤖 PyCardis Bot</strong>
                <p className="message__text__bot">Sulamita  just entered the room!</p>
            </div>
        </div>

        <div className="message__wrapper">
            <div className="message__body__bot">
                <strong className="message__author__bot">🤖 PyCardis Bot</strong>
                <p className="message__text__bot">Shahriar P. Shuvo  just entered the room!</p>
            </div>
        </div>

        <div className="message__wrapper">
            
            <div className="message__body">
                <strong className="message__author">Sulamita</strong>  
                <p className="message__text"> Great stream!</p>
            </div>
        </div>

        <div className="message__wrapper">
            
            <div className="message__body">
                <strong className="message__author">Dennis Ivy</strong>  
                <p className="message__text"> Convert RGB color 
                    codes to HEX HTML format for use 
                    in web design and CSS.</p>
            </div>
        </div>

        <div className="message__wrapper">
            
            <div className="message__body">
                <strong className="message__author">Shahriar P. Shuvo 👋</strong>  
                <p className="message__text">Does 
                    anyone know hen he will be 
                    back?</p>
            </div>
        </div>
        <div className="message__wrapper">
             
            <div className="message__body">
                <strong className="message__author">Sulamita</strong> 
                <p className="message__text">Great stream!</p>
            </div>
        </div>

        <div className="message__wrapper">
            
            <div className="message__body">
                <strong className="message__author">Dennis Ivy</strong>   
                <p className="message__text">Convert RGB color 
                    codes to HEX HTML format for use 
                    in web design and CSS.</p>
            </div>
        </div>

        <div className="message__wrapper">        
            <div className="message__body">
                <strong className="message__author">Shahriar P. Shuvo 👋</strong>
                <p className="message__text">Does 
                    anyone know hen he will be 
                    back?</p>
            </div>
        </div>

        <div className="message__wrapper">
            <div className="message__body">
                <strong className="message__author">Sulamita</strong>
                <p className="message__text">Great stream!</p>
            </div>
        </div>

        <div className="message__wrapper">
            <div className="message__body__bot">
                <strong className="message__author__bot">🤖 PyCardis Bot</strong>
                <p className="message__text__bot">👋 Sulamita  has left the room</p>
            </div>
        </div>

        <div className="message__wrapper">
            
            <div className="message__body">
                <strong className="message__author">Dennis Ivy</strong>
                <p className="message__text">Convert RGB color 
                    codes to HEX HTML format for use 
                    in web design and CSS.</p>
            </div>
        </div>

        <div className="message__wrapper">
            <div className="message__body">
                <strong className="message__author">Shahriar P. Shuvo 👋</strong>
                <p className="message__text">Does 
                    anyone know hen he will be 
                    back?</p>
            </div>
        </div>
    </div>

    <form id="message__form">
        <input type="text" name="message" placeholder="Send a message...." />
    </form>

</section>
  )
}

export default ChatRoom