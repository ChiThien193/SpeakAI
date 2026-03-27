import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlRIEH_2vjOUcU1Y6_5b4V88Pt_FLcYKo",
  authDomain: "speakai-d96f9.firebaseapp.com",
  projectId: "speakai-d96f9",
  storageBucket: "speakai-d96f9.firebasestorage.app",
  messagingSenderId: "412311002239",
  appId: "1:412311002239:web:e552d32d71d0f97f70b34a",
  measurementId: "G-2MZBF81J9N"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;