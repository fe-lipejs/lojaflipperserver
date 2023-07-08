const express = require('express');
const router = express.Router();
//controles
const authController = require('./app/controllers/authController');
const produtos = require('./app/controllers/api/Produtos')
const testeBuscarIdController = require('./app/controllers/testeBuscarIdController')
const Carrinho = require('./app/controllers/api/Carrinho')
//middlewares
const checarTokenMiddleware = require('./app/middlewares/checarTokenMiddleware')
//rotas API
const Categorias = require('./app/controllers/api/Categorias');








/* ---------------ROTAS APIS----------------- */

//--------------ROTAS GET-----------------
router.get('/hello', (req, res) => {
  res.send('Hello World!');
});
router.get('/categorias', Categorias.get);
router.get('/user/:id', checarTokenMiddleware, testeBuscarIdController.buscarId)
router.get('/produtos/:id_produto', produtos.get);
router.get('/produtos-home/:limite/:deslocamento', produtos.getProdutosHome); //exibir produtos na pagina inicial e com paginação
//carrinho
router.get('/carrinho', Carrinho.get);
//produto
router.get('/produtos-filtro', produtos.filtro);
router.get('/produtos-imagemcapa/:imageUrl', produtos.getImageCapa) // pega imagem de capa para exibir nos card de cada produto


//ROTAS POST
router.post('/produtos', produtos.post);
router.post('/register', authController.register);
router.post('/login', authController.login);
//---carrinho
router.post('/carrinho', Carrinho.post);
router.post('/carrinho/adicionar', Carrinho.adicionarCarrinho);
router.post('/carrinho/addquantidade', Carrinho.adicionarQuantidadeCarrinho);
router.post('/carrinho-delete/:id/:cor/:tamanho', Carrinho.delete);


//ROTAS DELETE



module.exports = router;