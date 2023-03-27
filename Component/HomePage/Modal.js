import React from 'react'
import { useState } from 'react';
import style from './Home.module.scss'
import {storage} from '../../utils/fireconnect';
import { db } from '../../utils/FireConnect'
import {getDownloadURL, ref,uploadBytesResumable} from 'firebase/storage';
import ReactPlayer from "react-player";
import { useSelector } from 'react-redux';
import { collection,getDoc,setDoc,doc ,onSnapshot,updateDoc,addDoc} from "firebase/firestore";
import BarLoader from "react-spinners/BarLoader";

const Modal = ({setModal}) => {
    const categories = useSelector((state)=>state.category);
    const[name,setName] =useState("");
    const[desc,setDesc]=useState("");
    const[cat,setCat] = useState(categories[0]);
    const[mediaFile,setMediaFile] = useState("");
    const[uploading,setUploading] = useState(false);
    function handleFile(event) {
		let file = event.target.files[0];
		upf(file);
	}

    const upf = (file) => {
        setUploading(true);
        const storageRef = ref(storage,`files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef,file);
        uploadTask.on('state_changed', (snapshot) =>{
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
			switch (snapshot.state) {
				case 'paused':
					console.log('Upload is paused');
					break;
				case 'running':
					console.log('Upload is running');
					break;
				default:
					console.log("default");
			}
        },(error)=>{
            console.log(error);
            setUploading(false);
        },()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                setMediaFile(downloadURL);
                setUploading(false);
				console.log("url file set");
            })
        })
	}
    const handleModal = ()=>{
        const dbRef = collection(db, "Cards");
        const data = {
            name:name,
            description:desc,
            media:mediaFile,
        };
        addDoc(dbRef, data)
        .then(async(docRef) => {
            const docRf = doc(db, "Category", cat);
            const docSnap = await getDoc(docRf);
            // console.log(docSnap.data());
            const data = {
                id:[...docSnap.data().id,docRef.id],
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
        setName("");
        setDesc("");
        setMediaFile("");
        setCat(categories[0]);
        setModal(false);
    }
  return (
    <div className={style.createModal}>
        {console.log(cat)}
        <p>Card Details</p>
        <input onChange={(e)=>{setName(e.target.value)}} placeholder='Card Name'></input>
        <textarea onChange={(e)=>{setDesc(e.target.value)}} placeholder="Card Description" style={{height:"fit-content"}}></textarea>
        <select onChange={(e)=>{setCat(e.target.value)}} >
        {
            Object.keys(categories).map((k,idx)=>(
                <option value={categories[k]}>{categories[k]}</option>
            ))
        }
        </select>
        <input type="file" accept="image/*,video/*" name="image" id="imageFile" onChange={handleFile}  style={{ display: "none" }} />
		<p>
            <label htmlFor="imageFile">Select an video to upload</label>
		</p>
        {uploading===true && <BarLoader color="#36d7b7" />}
        {ReactPlayer.canPlay(mediaFile) && <ReactPlayer onClick={()=>{console.log("video")}} playing={true} controls={true} width={"100%"} url={mediaFile} />}
        <button onClick={()=>handleModal()}>Create</button>
    </div>
  )
}

export default Modal