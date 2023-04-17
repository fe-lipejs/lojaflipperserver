const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv').config()


const db_name = process.env.DATABASE_NAME
const db_host = process.env.HOST
const db_port = process.env.PORT


const app = express();

app.use(bodyParser.json());

mongoose.connect(`mongodb://${db_host}:${db_port}/${db_name}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;

app.use('/', routes);

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000.');
});