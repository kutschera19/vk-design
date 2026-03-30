import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCku2aJNn03MyPTQTS-2P6Zn9bVHB5K2pA",
  authDomain: "vkdesigner-plataforma.firebaseapp.com",
  projectId: "vkdesigner-plataforma",
  storageBucket: "vkdesigner-plataforma.appspot.com",
  messagingSenderId: "889000098109",
  appId: "1:889000098109:web:3053a11bcc2e2fa3186d54"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const ADMIN_EMAIL = "vkdesign@admin.com";

console.log("APP CARREGOU");

window.fazerLogin = async function(email, pwd) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pwd);
    const role = cred.user.email === ADMIN_EMAIL ? 'admin' : 'cliente';
    const user = { email: cred.user.email, role };
    window.saveSession(user);
    window.entrarNaPlataforma(user);
  } catch(e) {
    alert("Erro: " + e.code);
  }
};

window.fazerCadastro = async function(email, pwd) {
  try {
    await createUserWithEmailAndPassword(auth, email, pwd);
    alert("Conta criada!");
  } catch(e) {
    alert("Erro: " + e.message);
  }
};

console.log("APP RODANDO");
