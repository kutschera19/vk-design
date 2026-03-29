import { db } from "./firebase.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function testeFirebase() {
  await addDoc(collection(db, "orders"), {
    service: "Teste VK",
    status: "pendente",
    price: 50,
    created_at: new Date()
  });

  alert("Firebase funcionando!");
}

window.testeFirebase = testeFirebase;
