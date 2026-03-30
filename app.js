import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

console.log("APP CARREGOU");

// ── Email fixo do admin ──
const ADMIN_EMAIL = "vkdesign@admin.com"; // ← troca pelo seu email real

// ── LOGIN ──
window.fazerLogin = async function(email, pwd) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pwd);
    const role = cred.user.email === ADMIN_EMAIL ? 'admin' : 'cliente';
    const user = { email: cred.user.email, role };
    saveSession(user);
    entrarNaPlataforma(user);
  } catch(e) {
    showErr(document.getElementById('errLogin'), 'E-mail ou senha incorretos.');
  }
};

// ── CADASTRO (só clientes) ──
window.fazerCadastro = async function(email, pwd) {
  if (email === ADMIN_EMAIL) {
    alert("Este e-mail não pode ser cadastrado.");
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, pwd);
    alert("Conta criada com sucesso!");
  } catch(e) {
    alert("Erro: " + e.message);
  }
};

console.log("APP RODANDO");
