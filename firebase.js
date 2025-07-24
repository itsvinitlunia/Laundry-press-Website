// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPLBc0wChs7ezPJz8KDhemJiRoGQx5t7o",
  authDomain: "laundrydash-a4b0c.firebaseapp.com",
  projectId: "laundrydash-a4b0c",
  storageBucket: "laundrydash-a4b0c.appspot.com",
  messagingSenderId: "164957650152",
  appId: "1:164957650152:web:b6f7c79f8b4e73e5885d5d",
  measurementId: "G-KRJVSYVFJP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
