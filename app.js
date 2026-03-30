import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

console.log("APP CARREGOU");

// ── CADASTRO ──
window.cadastrar = async function(email, senha) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    console.log("Conta criada:", cred.user.email);
    alert("Conta criada com sucesso!");
  } catch (e) {
    alert("Erro ao cadastrar: " + e.message);
  }
};

// ── LOGIN ──
window.login = async function(email, senha) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, senha);
    console.log("Logado:", cred.user.email);
    alert("Login realizado!");
  } catch (e) {
    alert("Erro ao logar: " + e.message);
  }
};

// ── LOGOUT ──
window.logout = async function() {
  await signOut(auth);
  alert("Saiu da conta!");
};

// ── DETECTA SE ESTÁ LOGADO ──
onAuthStateChanged(auth, function(user) {
  if (user) {
    console.log("Usuário logado:", user.email);
  } else {
    console.log("Nenhum usuário logado");
  }
});
