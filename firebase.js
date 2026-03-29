console.log ("FIREBASE CARREGOU");
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCku2aJNn03MyPTQTS-2P6Zn9bVHB5K2pA",
  authDomain: "vkdesigner-plataforma.firebaseapp.com",
  projectId: "vkdesigner-plataforma",
  storageBucket: "vkdesigner-plataforma.firebasestorage.app",
  messagingSenderId: "889000098109",
  appId: "1:889000098109:web:3053a11bcc2e2fa3186d54",
  measurementId: "G-LCTWFTQ9WW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
