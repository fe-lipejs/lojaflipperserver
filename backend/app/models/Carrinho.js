const mongoose = require('mongoose');

const carrinhoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  imagem: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  precoPromocional: {
    type: Number
  },
  cor: {
    type: String,
    required: true
  },
  tamanho: {
    type: String,
    required: true
  },
  quantidade: {
    type: Number,
    
  },



})

const CarrinhoModel = mongoose.model('CarrinhoModel', carrinhoSchema);

module.exports = CarrinhoModel