const mongoose = require('mongoose');

const produtosSchema = new mongoose.Schema({
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
  type: Map,
  of: {
    type: Map,
    of: {
      hex:{
        type:String
      },
      imagens: {
        type: Map,
        of: String
      },
      estoque: {
        type: Map,
        of: {
          tamanho: String,
          quantidade: Number
        }
      }
    }
  }
}


})

const Produto = mongoose.model('Produto', ProdutoSchema);

module.exports = Produto;





/* 

const ProdutoSchema = new mongoose.Schema({
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
    type:Map, 
        of:{
            type:Map,
            of: String
        }
  }
});


*/