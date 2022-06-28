import React, { useEffect } from 'react'
import '../../Styles/room.css'
import '../../App.css'
function Participants(props) {
  let {users}=props;
  //const users1=useUsers()[0];
  // useEffect(()=>{
  //    console.warn(users);
  // },[users]);
  const action=async()=>{
    
  }
  return (
    <section id="members__container">
      
    <div id="members__header">
        <p>Participants</p>
        <strong id="members__count">{users.length}</strong>
    </div>

    <div id="member__list">
        <div  className="member__wrapper" id="member__1__wrapper">
            <span className="green__icon"></span>
            <p className="member_name">{users[0]}</p>
            <p><button className="volume" > <i className="fa-solid fa-volume-high"></i> </button></p>
            100
            <p><button className="volume" > <i className="fa-solid fa-volume-low"></i> </button></p>
            
        </div>
        {users.slice(1,10).map(user=>(
          <div key={user._uintid} className="member__wrapper" id="member__1__wrapper">
          <span className="green__icon"></span>
          <p className="member_name">{user.uid}</p>
          <p><button className="volume" > <i className="fa-solid fa-volume-high"></i> </button></p>
            100
            <p><button className="volume" > <i className="fa-solid fa-volume-low"></i> </button></p>
      </div>
        ))
      }

    </div>

    </section>
  )
}

export default Participants