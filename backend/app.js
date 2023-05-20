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
const db_name = process.env.DATABASE_NAME
const db_host = process.env.HOST
const db_port = process.env.PORT
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


/* app.use(session({
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
 */

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
  .connect(`mongodb://${db_host}:${db_port}/${db_name}`)
  .then(() => {
    app.listen(3000)
    console.log('Conectado ao Banco de Dados')
  })
  .catch((err) => console.log('Houve um erro no DB: ' + err))

