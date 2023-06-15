
// Import the functions you need from the SDKs you need
const {initializeApp} = require('firebase/app');
const { collection, addDoc } = require("firebase/firestore");


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD37pOEKCkV8IhpQQqlqR-7ggCB2onzDvk",
  authDomain: "gameflix-8f6e3.firebaseapp.com",
  projectId: "gameflix-8f6e3",
  storageBucket: "gameflix-8f6e3.appspot.com",
  messagingSenderId: "516035817061",
  appId: "1:516035817061:web:4e06ae04a5f17a3040a08c",
  measurementId: "G-BMJHP270ZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

async function addJogosBanco(jogoNome, JogoImagem){
    try {
        const docRef = await addDoc(collection(db, "users"), {
          nome: jogoNome,
          imagem: JogoImagem,
          disponivel: true
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}


