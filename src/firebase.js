import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFmMnwnwfKsfUcJMCX-tFjXpR8xbBKV08",
  authDomain: "gen-lang-client-0352686033.firebaseapp.com",
  projectId: "gen-lang-client-0352686033",
  storageBucket: "gen-lang-client-0352686033.firebasestorage.app",
  messagingSenderId: "670353730533",
  appId: "1:670353730533:web:18dba13a3513df97dc5d0c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app, "ai-studio-126539ed-a925-4d8e-9b57-1a5c572652e5");