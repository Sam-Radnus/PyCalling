import React from 'react'
import '../App.css'
import {Link ,Navigate,useNavigate,useLocation} from 'react-router-dom';
function Landing() {
  return (
    <div>
            <header id="nav">
        <div className="nav--list">
             <Link to="/">
                 <h3 id="logo">
                    
                     <span> PyCalling</span>
                 </h3>
             </Link>    
        </div>
 
         <div id="nav__links">
             <Link className="nav__link" id="create__room__btn" to="/Lobby">
                 Create Room
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ede0e0" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/></svg>
             </Link>
         </div>
     </header>

    <section className="hero__section">
       
        <div style={{marginLeft:'20%'}} className="hero__section__img">
        <h1 style={{zIndex:'999',fontSize:'50px',position:'absolute',top:'20%'}}>Join in Now</h1>
        <img id="hover" style={{maxHeight:'550px',objectFit:'contain'}} src={require("./images/lobby.png")}/> 
        <img id="background"style={{height:'750px'}} src={require("./images/image.png")}/> 
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