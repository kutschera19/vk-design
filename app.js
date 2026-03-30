import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

console.log("APP CARREGOU");

const ADMIN_EMAIL = "vkdesign@admin.com";

window.fazerLogin = async function(email, pwd) {
  alert("Tentando login com: " + email); // ← temporário
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pwd);
    const role = cred.user.email === ADMIN_EMAIL ? 'admin' : 'cliente';
    const user = { email: cred.user.email, role };
    window.saveSession(user);
    window.entrarNaPlataforma(user);
  } catch(e) {
    alert("Erro Firebase: " + e.code); // ← mostra erro exato
  }
};

window.fazerCadastro = async function(email, pwd) {
  try {
    await createUserWithEmailAndPassword(auth, email, pwd);
    alert("Conta criada com sucesso!");
  } catch(e) {
    alert("Erro: " + e.message);
  }
};

console.log("APP RODANDO");
