// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlRIEH_2vjOUcU1Y6_5b4V88Pt_FLcYKo",
  authDomain: "speakai-d96f9.firebaseapp.com",
  projectId: "speakai-d96f9",
  storageBucket: "speakai-d96f9.firebasestorage.app",
  messagingSenderId: "412311002239",
  appId: "1:412311002239:web:e552d32d71d0f97f70b34a",
  measurementId: "G-2MZBF81J9N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);