import React, { useEffect, useState } from 'react'
import style from './Home.module.scss'
import { db } from '../../utils/FireConnect'
import { collection,getDocs,setDoc,doc ,onSnapshot,deleteDoc} from "firebase/firestore";
import { async } from '@firebase/util';
import {useDispatch,useSelector } from 'react-redux';
import { updateCategory } from '../../redux/CategoryInfo';
const Sidebar = ({cat,setCat}) => {
    const[allcat,setAllCat] = useState([]);
    const[search,setSearch] = useState(false);
    const[add,setAdd] = useState("");
    const dispatch = useDispatch();
    useEffect(()=>{
        async function fetch(){
            let set = new Set([]);
            const colRef = collection(db,"Category");
            const docsSnap = await getDocs(colRef);
            docsSnap.forEach(doc => {
                set.add(doc.id);
            })
            dispatch(updateCategory(Array.from(set)));
        }
        fetch();
        const unsub = onSnapshot(collection(db,"Category"), docsSnap => {
                let set = new Set([]);
                docsSnap.forEach(doc => {
                    set.add(doc.id);
                })
                setAllCat(Array.from(set));
                dispatch(updateCategory(Array.from(set)));
        }); 
        return unsub;
    },[])
    const handleClick = async()=>{
        setSearch(false);
        const docRef = doc(db,"Category",add);
        const data={
            id:[],
        }
        setDoc(docRef, data)
        .then(() => {
            console.log("Document has been added successfully")
        })
        .catch(error => {
            console.log(error);
        })
    }
    const handleDelete = (ct)=>{
        if (confirm('Are you sure?')) {
            console.log("HOMe");
           
            const docRef = doc(db, "Category", ct);
            deleteDoc(docRef)
            .then(() => {
                setCat("Home");
            })
            .catch(error => {
                console.log(error);
                
            })
        }
       
    }
  return (
    <div className={style.sideBar}>
        <div className={style.add}>
            <p>Add Bucket</p>
            {search===false &&   <img onClick={()=>{setSearch(!search)}}src={"/images/add.png"}></img>}
            {search===true &&   <img onClick={()=>{setSearch(!search)}}src={"/images/minus.png"}></img>}
        </div>
        {search==true && (
                <div className={style.input}>
                    <input onChange={(e)=>(setAdd(e.target.value))} placeholder='Enter Category'></input>
                    <button onClick={()=>handleClick()}>add</button>
                </div>
        )}
        
        <div onClick={()=>{setCat("Home")}} style={{backgroundColor:cat=="Home"?"grey":"transparent"}}>Home</div>
        {allcat.map((ct,idx)=>(
            <div key={idx+"cat"} onClick={()=>{setCat(ct)}}  style={{backgroundColor:cat==ct?"grey":"transparent",display:"flex",alignItems:'center',justifyContent:"space-between"}}>
                <p>{ct}</p>
                <img onClick={()=>handleDelete(ct)} style={{height:"20px",width:"20px",marginRight:"20px"}}src={'/images/delete.svg'}></img>
            </div>
        ))}
    </div>
  )
}

export default Sidebar