import React from 'react'
import '../App.css'
import {Link ,Navigate,useNavigate,useLocation} from 'react-router-dom';
function Landing() {
  const navigate=useNavigate();
  return (
    <div style={{height:'100vh',width:'100vw',backgroundColor:'white'}}>
            {/* <header id="nav">
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
     </header> */}
    <div className="landing" >
        <div className="intro">
        <h1>Welcome to PyCalling</h1>
        <button onClick={()=>{ navigate('/Lobby')}} style={{backgroundColor:'white',cursor:'pointer',padding:'15px'}}>Join a Room</button>
        </div>
        <div className="snap">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi cumque labore beatae. Facere architecto, repellat, obcaecati reiciendis dolor est quia et atque accusantium recusandae suscipit excepturi, doloremque in id ad non hic cumque dicta sit rerum asperiores. Iusto voluptatem explicabo, ipsam tempore nemo magni laudantium quisquam sed distinctio aliquid architecto.
        </div>
    </div>
  </div>
  )
}

export default Landing