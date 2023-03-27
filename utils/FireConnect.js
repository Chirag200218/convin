import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3gb3mY3Kp9PaArbrVW6ERPCVZp-R1Hzs",
  authDomain: "card-app-7410b.firebaseapp.com",
  projectId: "card-app-7410b",
  storageBucket: "card-app-7410b.appspot.com",
  messagingSenderId: "199905162625",
  appId: "1:199905162625:web:5f7e294555363afedba480"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const storage = getStorage(app);
export { db,storage } 