// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBv5u42bdedQrAvvXfyi8OyBPlnFEUe9PA",
  authDomain: "agewellapp-a915a.firebaseapp.com",
  projectId: "agewellapp-a915a",
  storageBucket: "agewellapp-a915a.appspot.com",
  messagingSenderId: "90053882324",
  appId: "1:90053882324:web:b79906d1db1d6be3d4e641",
  measurementId: "G-PWVVXYF17F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ This line is critical

export { auth, db }; // ✅ Now you're exporting both
