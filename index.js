const express = require('express'); //Import the express dependency
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening
const cors = require('cors');

const { initializeApp, applicationDefault, cert, } = require('firebase-admin/app');
const  admin  = require('firebase-admin');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
var MD5 = require("crypto-js/md5");
const session = require("express-session");

const firebaseConfig = {
  apiKey: "AIzaSyD37pOEKCkV8IhpQQqlqR-7ggCB2onzDvk",
  authDomain: "gameflix-8f6e3.firebaseapp.com",
  projectId: "gameflix-8f6e3",
  storageBucket: "gameflix-8f6e3.appspot.com",
  messagingSenderId: "516035817061",
  appId: "1:516035817061:web:4e06ae04a5f17a3040a08c",
  measurementId: "G-BMJHP270ZM"
};
var serviceAccount = require("./gameflix-8f6e3-firebase-adminsdk-6ifuf-05a2265a4c.json");
// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
app.use(express.json());

app.use(session({
  secret: "algum segredo",
  saveUninitialized: true,
  resave: true
}));

app.use(function(req, res, next) {
  // permitir a origem http://localhost:5000
  res.header("Access-Control-Allow-Origin", "http://localhost:5000");
  // permitir os métodos GET e POST
  res.header("Access-Control-Allow-Methods", "GET, POST");
  // permitir o cabeçalho Content-Type
  res.header("Access-Control-Allow-Headers", "Content-Type");
  // prosseguir com a requisição
  next();
});

app.use(cors({
  origin: "*",
})); // habilita o CORS para todas as rotas


// Obtenha uma referência ao serviço do Cloud Firestore
const db = getFirestore();

//Idiomatic expression in express to route and respond to a client request
app.use('/static', express.static('public'))

app.get('/', (req, res) => {  
     res.sendFile('index.html', {root: __dirname});    
  
         
});
app.get('/adicionar', (req, res) => {         
    let usuario= req.session.usuario;
    if(usuario){
      res.sendFile('addgames.html', {root: __dirname}); 
    }
    else{
      res.sendFile('loginadmin.html', {root: __dirname});     }   
                                                        
});

app.get('/atualizar', (req, res) => {        
  let usuario = req.session.usuario;
  if(usuario){
    res.sendFile('atualizagames.html', {root: __dirname}); 
  }
  else{
    res.sendFile('loginadmin.html', {root: __dirname});   }    
                                                       
});

app.get('/loginadmin', (req, res) => {        //get requests to the root ("/") will route here
  res.sendFile('loginadmin.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                      //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});



// Crie uma rota put que receba o id do jogo como parâmetro
app.post("/addjogo", async (req, res) => {
  // Obtenha o id do jogo a partir do parâmetro
  const { nome, imagem, descricao, versao} = req.body;
  const disponivel = "Disponível";
  // Valide os dados do jogo
  console.log("Nome do jogo:", nome);
  if (!nome || !imagem) {
    // Envie uma resposta de erro se os dados forem inválidos
    return res.status(400).send("Dados inválidos!");
  }
  // Acesse um documento na coleção "jogos" com o id fornecido

     const docRef = db.collection('jogos').doc(nome);

    await docRef.set({
        nome: nome,
        imagem: imagem,
        disponivel: disponivel,
        descricao: descricao,
        versao: versao
    });
});


app.get('/lerjogos', async (req, res) => {
  const snapshot = await db.collection('jogos').get();
  // create an empty array to store the documents
  let jogos = [];
  snapshot.forEach((doc) => {
    // push each document data to the array
    jogos.push(doc.data());
  });
  // send the array as a JSON response
  console.log(jogos);
  res.json(jogos);
});

                        



app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
    //console.log(MD5("c").toString());
});

app.post("/atualizajogo", async (req, res) => {
  // Obtenha o id do jogo a partir do parâmetro
  const { nome, descricao, versao, disponivel } = req.body;
  // Valide os dados do jogo
  console.log("Nome do jogo:", nome);
  if (!nome) {
    // Envie uma resposta de erro se os dados forem inválidos
    return res.status(400).send("Dados inválidos!");
  }
  // Acesse um documento na coleção "jogos" com o id fornecido

     const docRef = db.collection('jogos').doc(nome);

    await docRef.update({
        nome: nome,
        disponivel: disponivel,
        descricao: descricao,
        versao: versao
    });
});

app.post("/deletarjogo", async (req, res) => {
  // Obtenha o id do jogo a partir do parâmetro
  const { nome} = req.body;
  // Valide os dados do jogo
  console.log("Nome do jogo:", nome);
  if (!nome) {
    // Envie uma resposta de erro se os dados forem inválidos
    return res.status(400).send("Dados inválidos!");
  }
  // Acesse um documento na coleção "jogos" com o id fornecido

     const docRef = db.collection('jogos').doc(nome);

    await docRef.delete();
    res.sendFile('atualizagames.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
    

});

app.post('/login', async (req, res) => {
    // Obtenha o id do jogo a partir do parâmetro
    let { admin, senha} = req.body;
    // Valide os dados do jogo
    if (!admin || !senha) {
      // Envie uma resposta de erro se os dados forem inválidos
      return res.status(400).send("Dados inválidos!");
    }
    // Acesse um documento na coleção "jogos" com o id fornecido
    //senha = MD5(senha).toString();
    //console.log(senha);
    db.collection("admin")
    .doc(admin)
    .get()
    .then((doc) => {
      // Verificar se o documento existe
      if (doc.exists) {
        // Obter os dados do documento
        const data = doc.data();
        //console.log("server: "+data.senha);
        // Comparar a senha informada com a senha armazenada
        if (senha == data.senha) {
          // Se as senhas forem iguais, redirecionar para a página atualizajogos.html
          console.log("Senhas iguais");
          //res.sendFile('atualizagames.html', {root: __dirname});
          req.session.usuario = "Diego";
          res.redirect('http://localhost:5000/atualizar');
        } else {
          // Se as senhas forem diferentes, enviar um alerta
          console.log("Senhas diferentes");
          throw new Error("Senha ou Usuário Incorretos");
        }
      } else {
        // Se o documento não existir, enviar um alerta
        throw new Error("Senha ou Usuário Incorretos");    
      }
    })
    .catch((error) => {
      // Em caso de erro, enviar uma mensagem de erro
      res.status(500).send("Erro: " + error.message);
    });

});