import React, { useEffect } from 'react'
import '../../Styles/room.css'
import '../../App.css'
function Participants(props) {
  let {users}=props;
  //const users1=useUsers()[0];
   useEffect(()=>{
      console.warn(users);
   },[users]);
  const action=async()=>{
    
  }
  return (
    <></>
  )
}

export default Participants