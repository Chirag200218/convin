import React, { useEffect } from 'react'
import style from './Home.module.scss'
import ReactPlayer from 'react-player';
import { db } from '../../utils/FireConnect';
import firebase from "firebase/app";
import { getFirestore, getDocs,collection, addDoc,Timestamp,doc ,updateDoc} from "firebase/firestore";

const PlayVideo = ({desc,media,setVideo,name,cat,id}) => {
  useEffect(()=>{
    async function add(){
      const dbRef = collection(db, "Visited");
      const docsSnap = await getDocs(dbRef);
      let upd = false;
      let idDoc=  -1;
      docsSnap.forEach(doc => {
          if(doc.data().id===id){
            upd=true;
            idDoc=doc.id;
          }
      })
      if(upd===true){
        const docRef = doc(db, "Visited", idDoc);
        const data = {
          created: Date.now(),
        }
        updateDoc(docRef, data)
        .then(docRef => {
            console.log("A New Document Field has been added to an existing document");
        })
        .catch(error => {
            console.log(error);
        })
      }else{
        const data = {
          id:id,
          name:  name,
          media: media,
          cat:cat,
          created: Date.now(),
       };
       addDoc(dbRef, data)
        .then(docRef => {
            console.log("Document has been added successfully");
        })
        .catch(error => {
            console.log(error);
        })
      }
    }
    add();
  },[])
  return (
    <>
    <div className={style.blur}></div>
       <div className={style.videoBox}>
        
        <img onClick={()=>{setVideo("video")}} src={'images/close.png'}></img>
        <p style={{height:"12%",fontSize:"44px",alignItems:"flex-end"}}>{name}</p>
        <ReactPlayer onClick={()=>{console.log("video")}} playing={true} controls={true} height={"400px"} width={"100%"} url={media} />
        <p style={{fontSize:"16px",margin:"10px 0px"}}>{desc}</p>
      </div>
    </>
   
  )
}

export default PlayVideo