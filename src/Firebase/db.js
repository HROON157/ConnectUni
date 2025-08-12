import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVTWtFf3Lo2dWxPJoUN8Y5gRcN-fL9Hkc",
  authDomain: "connectuni-e0a42.firebaseapp.com",
  projectId: "connectuni-e0a42",
  storageBucket: "connectuni-e0a42.firebasestorage.app",
  messagingSenderId: "1017457439064",
  appId: "1:1017457439064:web:24b29c86ea57424e4fb52d",
  measurementId: "G-7R59V85WDH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };