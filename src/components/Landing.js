import React from 'react'
import '../App.css'
function Landing() {
  return (
    <div>
            <header id="nav">
        <div className="nav--list">
             <a href="/"/>
                 <h3 id="logo">
                      <img src={require("./images/logo.png")} alt="Site Logo"/> 
                     <span> PyCalling</span>
                 </h3>
        </div>
 
         <div id="nav__links">
             <a className="nav__link" id="create__room__btn" href="lobby.html">
                 Create Room
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ede0e0" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/></svg>
             </a>
         </div>
     </header>

    <section className="hero__section">
        <h2>Interactive Chat & Streaming</h2>
        <div className="hero__section__img">
             <img style={{maxHeight:'550px',objectFit:'contain'}} src={require("./images/Group 42 (3).png")}/> 
        </div>
    </section>
    
    <main >
        <section id="room__list">
            <h3 id="room__listTitle">Live Now: <span id="rooms__count">0</span></h3>
            <div className="room__container">
               
            </div>
        </section>
     </main>
    </div>
  )
}

export default Landing