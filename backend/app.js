// imports:
require('dotenv').config()
const bodyParser = require('body-parser');
const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const router = require('./routes');
const cors = require('cors');


const db_name = process.env.DATABASE_NAME
const db_host = process.env.HOST
const db_port = process.env.PORT



const app = express()
//permitir json
//app.use(express.json())
app.use(bodyParser.urlencoded({limit: '500mb', extended: true }));

// Configurar o body-parser
app.use(bodyParser.json({ limit: '500mb' }));

//app.use(bodyParser.urlencoded({ }));


app.use('/', router);


// habilita o CORS para todas as solicitações
/* app.use(cors({
  origin: 'http://localhost:8080/', // ou outra porta que você esteja usando
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})); */
mongoose
  .connect(`mongodb://${db_host}:${db_port}/${db_name}`)
  .then(() => {
    app.listen(3000)
    console.log('Conectado ao Banco de Dados')
  })
  .catch((err) => console.log('Houve um erro no DB: ' + err))

