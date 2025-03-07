import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDmr30vj9VLwB_55U2hqFeTQ1Jk3AzLXqg",
    authDomain: "junior-6cb8d.firebaseapp.com",
    projectId: "junior-6cb8d",
    storageBucket: "junior-6cb8d.appspot.com",
    messagingSenderId: "739555490351",
    appId: "1:739555490351:web:dd21d2f15e9c1b546d24da",
    measurementId: "G-Q1WC4818NL"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
