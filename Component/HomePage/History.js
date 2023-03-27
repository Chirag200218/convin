import React from 'react'
import { useEffect,useState } from 'react';
import { db } from '../../utils/FireConnect';
import { getDocs, collection,onSnapshot,query, orderBy,limit } from "firebase/firestore";
import ReactPlayer from 'react-player';
import style from './Home.module.scss'
const History = () => {
    const[history,setHistory] = useState([]);
    useEffect(()=>{
        async function fetch(){
          const dbRef = collection(db, "Visited");
          const docsSnap = await getDocs(dbRef,orderBy("created","desc"));
          let data=[];
          docsSnap.forEach(doc => {
            data.push(doc.data());
          })
          console.log(data);
          data.sort(function(a,b){
            return b.created - a.created;
          });
          console.log(data);
          setHistory(data);
        }
        fetch();
    
        let dat=[];
        const unsub = onSnapshot(collection(db, "Visited"),orderBy("created","desc"),docsSnap => {
          docsSnap.forEach(doc => {
            dat.push(doc.data());
          })
          console.log(dat);
          dat.sort(function(a,b){
            return b.created - a.created;
          });
          console.log(dat);
          setHistory(dat);
        });
        return unsub;
    
      },[])

  return (
    <div className={style.historyTab}>
              <p style={{fontSize:"36px",color:"grey",fontWeight:"500",marginBottom:"10px"}}>Recently Played</p>
              <div className={style.allTab} style={{overflow:"scroll"}}>
                {
                  history.map((hist,idx)=>(
                    <div key={idx+"hist"+hist.name} className={style.visitTab}>
                      <div className={style.video}>
                      <ReactPlayer onClick={()=>{console.log("video")}} playing={false} controls={false} height={"100%"} width={"100%"} url={hist.media} />
                      </div>
                      <div className={style.aboutVis}>
                        <p style={{fontWeight:"500",fontSize:"28px",textTransform:"uppercase"}}>{hist.name}</p>
                        <p style={{fontWeight:"400",fontSize:"22px"}}>Category: {hist.cat}</p>
                      </div>
                      <div className={style.timeBox}>
                        <p style={{fontSize:"18px",fontWeight:"500",margin:"10px 0px"}}>Last Accessed At</p>
                        <p>{new Date(hist.created).toString()}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
    </div>
  )
}

export default History