import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBsoDgD5yX-pZeGeBImXr8m7Dki-HYOWZE",
  authDomain: "addio-11148.firebaseapp.com",
  projectId: "addio-11148",
  storageBucket: "addio-11148.firebasestorage.app",
  messagingSenderId: "925798005766",
  appId: "1:925798005766:web:86d9c69eddc7bc9f745787",
  measurementId: "G-VMHGS6YK6Y"
};

initializeApp(firebaseConfig);

const storage = getStorage();

export default storage;