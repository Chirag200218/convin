import React, { useEffect, useState } from 'react';
import style from './Home.module.scss';
import { collection,getDoc,setDoc,doc ,onSnapshot,updateDoc,addDoc,deleteDoc} from "firebase/firestore";
import { db } from '../../utils/FireConnect'
import ReactPlayer from 'react-player';
import PlayVideo from './PlayVideo';
import BeatLoader from "react-spinners/BeatLoader";
import { useSelector } from 'react-redux';
import { async } from '@firebase/util';

const Card = ({cat,setCat}) => {
    const category = useSelector((state)=>state.category);
    const[data,setData]=useState([]);
    const[video,setVideo] = useState("video");
    const[name,setName] = useState("");
    const[load,setload]= useState(true);
    const[desc,setDesc] = useState("");
    const[swap,setSwap] = useState("");
    const[clicked,setClicked] = useState("");
    const[id,setId] = useState("");
    useEffect(()=>{
        async function fetch(){
            setload(true);
            const docRf = doc(db, "Category", cat);
            const docSnap = await getDoc(docRf);
            if(docSnap.data()!==undefined){
                let ids = docSnap.data()?.id;
                let collect =[];
                await Promise.all(ids.map(async(id)=>{
                    const docRef = doc(db, "Cards", id);
                    const docSap = await getDoc(docRef);
                    let obj = docSap.data();
                    obj.id = docSap.id;
                    if(docSap.data()!==undefined)
                        collect.push(obj);
                })) 
                setData(collect);
            }
            setload(false);
        }
        fetch();
        
        const unsub = onSnapshot(collection(db,"Cards"),async (docsSnap)=>{
            setload(true);
            const docRf = doc(db, "Category", cat);
            const docSnap = await getDoc(docRf);
            if(docSnap.data()!==undefined){
                let ids = docSnap.data().id;
                let collect =[];
                await Promise.all(ids.map(async(id)=>{
                    const docRef = doc(db, "Cards", id);
                    const docSap = await getDoc(docRef);             
                    if(docSap.data()!==undefined){
                        let obj = docSap.data();
                        obj.id = docSap.id;
                        collect.push(obj);
                    }
                    
                })) 
                setData(collect);
            }
            setload(false);
        })

        const unsub2 = onSnapshot(collection(db,"Category"),async (docsSnap)=>{
            setload(true);
            const docRf = doc(db, "Category", cat);
            const docSnap = await getDoc(docRf);
            if(docSnap.data()!==undefined){
                let ids = docSnap.data()?.id;
                let collect =[];
                await Promise.all(ids.map(async(id)=>{
                    const docRef = doc(db, "Cards", id);
                    const docSap = await getDoc(docRef);             
                    if(docSap.data()!==undefined){
                        let obj = docSap.data();
                        obj.id = docSap.id;
                        collect.push(obj);
                    }
                })) 
                setData(collect);
            }
            setload(false);
        })
        return unsub;
    },[cat]);

    const handleClick = (id)=>{
        console.log(id);
        const docRef = doc(db, "Cards", id);
        deleteDoc(docRef)
        .then(async() => {
            const docRf = doc(db, "Category", cat);
            const docSnap = await getDoc(docRf);
            let idArray=[];
            docSnap.data().id.map((ids)=>{
                if(ids!==id){
                   idArray.push(ids); 
                }
            })
            const data = {
                id:idArray,
            }
            updateDoc(docRf, data)
            .then(d => {
                console.log("A New Document Field has been added to an existing document");
            })
            .catch(error => {
                console.log(error);
            })
        })
        .catch(error => {
            console.log(error);
        })
 
    };

    const swapCat = async(c,i)=>{
        console.log(c,cat,i)
        const docRf = doc(db, "Category", cat);
        const docSnap = await getDoc(docRf);
        let idArray=[];
        docSnap.data().id.map((ids)=>{
            if(ids!==i){
               idArray.push(ids); 
            }
        })
        console.log(idArray);
        const data = {
            id:idArray,
        }
        updateDoc(docRf, data)
        .then(d => {
            console.log("A New Document Field has been added to an existing document");
        })
        .catch(error => {
            console.log(error);
        })

        const docRef = doc(db, "Category", c);
        const docSap = await getDoc(docRef);
         
        const d = {
            id:[...docSap.data().id,i],
        }
        console.log(d);
        updateDoc(docRef, d)
        .then(d => {
            console.log("A New Document Field has been added to an existing document");
        })
        .catch(error => {
            console.log(error);
        })
        setCat(c);
    }
    if(load){
        return(
            <BeatLoader color="#36d7b7" />
        )
    }
  return (
    <>
     
    {video!=="video" && <PlayVideo desc={desc} name={name} media={video} setVideo={setVideo} cat={cat} id={id}/> }
     {data.length===0 && <p>This bucket doesn't have a card</p>}
    {  
        data.map((d,idx)=>{
            return(
            <div key={idx+"@"+cat} className={style.cardBox}>
                <img style={{top:"10px",right:"10px"}} onClick={()=>{handleClick(d.id)}} src={"/images/trash.png"}></img>
                <img style={{top:"50px",right:"10px"}} onClick={()=> clicked!==d.id?setClicked(d.id):setClicked("")}  src={"/images/transfer.png"}></img>
                {
                    clicked===d.id &&   
                    <div className={style.swaping}>
                        {
                            Object.keys(category).map((c)=>(
                                <p onClick={()=>swapCat(category[c],d.id)}>{category[c]}</p>
                            ))
                        }
                    </div>                          
                }
                <div onClick={()=>{setVideo(d.media),setName(d.name),setDesc(d.description),setId(d.id)}} className={style.video}> 
                    <ReactPlayer onClick={()=>{console.log("video")}} playing={false} controls={false} height={"100%"} width={"100%"} url={d.media} />
                </div>      
                <div className={style.aboutCard}>
                    <p style={{fontSize:"21px"}}>{d.name}</p>
                    <p style={{marginTop:"6px",fontSize:"15px",color:"grey"}}>{d.description}</p>
                </div>
            </div>
        )})
    }
    </>
  )
}

export default Card