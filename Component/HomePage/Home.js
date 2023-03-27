import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import style from './Home.module.scss'
import { useState } from 'react'
import Modal from './Modal'
import Card from './Card'
import History from './History'


const Home = () => {
  const[cat,setCat] = useState("Home");
  const[modal,setModal] = useState(false);
 
  return (
    <div className={style.App}>
      <Sidebar cat={cat} setCat={setCat}/>
      {
        cat==="Home" && (
          <div className={style.MainBar}>
            <div className={style.createCard}>
              <p>Create a Card</p>
              {modal===false &&  <img onClick={()=>{setModal(!modal)}}src={"/images/add.png"}></img>}
              {modal===true &&  <img onClick={()=>{setModal(!modal)}}src={"/images/minus.png"}></img>}
             
            </div> 
            <History/>
            {
              modal===true && (
                <Modal setModal={setModal}/>
              )
            }
          </div>
        )
      }
      {

        cat!=="Home" && (
          <div className={style.MainCat}>
            <Card cat={cat} setCat={setCat}/>
          </div>
        )
      }

    </div>
  )
}

export default Home