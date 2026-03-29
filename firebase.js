console.log("FIREBASE CARREGOU");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCku2aJNn03MyPTQTS-2P6Zn9bVHB5K2pA",
  authDomain: "vkdesigner-plataforma.firebaseapp.com",
  projectId: "vkdesigner-plataforma",
  storageBucket: "vkdesigner-plataforma.appspot.com",
  messagingSenderId: "889000098109",
  appId: "1:889000098109:web:3053a11bcc2e2fa3186d54"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
