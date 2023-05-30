// imports:
require('dotenv').config()
const bodyParser = require('body-parser');
const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const router = require('./routes');
const cors = require('cors');
const session = require('express-session');
const https = require('https');
const fs = require('fs');

//---------------CRIAÇÃO SERVIDOR HTTPS SIMPLES-----------



//-----------------------------------------------
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const dbURL = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
const dbURL2 = `mongodb://raffroslipeadmin:Je4everSus77@45.93.100.74:27017/LojaFlipper`;

//----------------------------------------------



const app = express()
app.use(cors({
  origin: true,
  credentials: true,
  exposedHeaders: ['set-cookie']

}));
app.use((req, res, next) => {

  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
})


 app.use(session({
  // store: new RedisStore({client: RedisStore}),
  secret: 'outraChaveSecreta',
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'none',
    secure: false,
    // httpOnly: true,
    maxAge: 5 * 60 * 1000,
    domain: '127.0.0.1',
    path: '/'
  }
}))
 

//--------------------------------------------------------------
//permitir json
//app.use(express.json())
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

// Configurar o body-parser
app.use(bodyParser.json({ limit: '500mb' }));


//app.use(bodyParser.urlencoded({ }));


// Adicione aqui as rotas do servidor:
app.use('/', router);

// Atualize o cabeçalho Access-Control-Allow-Origin para corresponder à origem da solicitação

//-------------------------------------------------------------




// habilita o CORS para todas as solicitações
/* {
 origin: 'http://localhost:8080/', // ou outra porta que você esteja usando
 allowedHeaders: ['Content-Type', 'Authorization'],
 methods: ['GET', 'POST', 'PUT', 'DELETE']
}));  
*/

mongoose
  .connect(dbURL)
  .then(() => {
    app.listen(3000)
    console.log('Conectado ao Banco de Dados')
  })
  .catch((err) => console.log(err))

