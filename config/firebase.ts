// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB4Lw7gQFjzQ4ZToBOFjcTpULEXBHxe6IA",
    authDomain: "whats-app-a48af.firebaseapp.com",
    projectId: "whats-app-a48af",
    storageBucket: "whats-app-a48af.appspot.com",
    messagingSenderId: "459089127019",
    appId: "1:459089127019:web:dffcd29ed200392a73332e",
    measurementId: "G-DXWXW3F464"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const db = getFirestore(app)

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export { db, auth, provider }