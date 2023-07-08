require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = require('./routes');
const cors = require('cors');
const session = require('express-session');
const https = require('https');
const fs = require('fs');

const portServer = 3000;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const dbURL = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
const dbURL2 = `mongodb://${dbHost}:${dbPort}/${dbName}`;

const app = express();
//app.set('trust proxy',1)
app.use(cors({
  origin: 'http://127.0.0.1:8080',
  credentials: true,
  exposedHeaders: ['set-cookie']
}));

app.use(session({
  secret: 'outraChaveSecreta',
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'none',
    secure: true,
    httpOnly: false,
    maxAge: 5 * 50 * 1000
  }
}));

app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(bodyParser.json({ limit: '500mb' }));

app.use('/', router);

// Carregar os certificados SSL
const privateKey = fs.readFileSync('./privkey.pem', 'utf8');
const certificate = fs.readFileSync('./cert.pem', 'utf8');
const ca = fs.readFileSync('./chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

// Criar o servidor HTTPS
const httpsServer = https.createServer(credentials, app);

mongoose
  .connect(dbURL2)
  .then(() => {
    httpsServer.listen(portServer);
    console.log('Conectado ao Banco de Dados, o servidor HTTPS está rodando na porta:', portServer);
  })
  .catch((err) => console.log(err));

