import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyBF_UIsOP1Py81pWwjJNdDFTHmoLU2ITlk",
  authDomain: "book-store-504e9.firebaseapp.com",
  projectId: "book-store-504e9",
  storageBucket: "book-store-504e9.appspot.com",
  messagingSenderId: "948021242648",
  appId: "1:948021242648:web:6a6354368ef2c6e50c8c6d"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);




export {
    db,
}