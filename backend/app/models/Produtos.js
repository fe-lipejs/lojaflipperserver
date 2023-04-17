const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: true
  },
  subcategoria: {
    type: String,
    required: true
  },
  nomeProduto: {
    type: String,
    required: true
  },
  sku: {
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

  produtoEstoque: {
    type: Map, of: { //cor
        hex: {type: String},
        imagens: {
          type: Object,
        },
        estoque: {
          
          type:Object
        }, 
    
   
    }
  }


})

const produtoCollection = mongoose.model('Produtos', produtoSchema);

module.exports = produtoCollection;
