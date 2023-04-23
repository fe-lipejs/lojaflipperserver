const express = require('express');
const cors = require('cors');
const router = express.Router();
//controles
const authController = require('./app/controllers/authController');
const produtos = require('./app/controllers/api/Produtos')
const testeBuscarIdController = require('./app/controllers/testeBuscarIdController')
//middlewares
const checarTokenMiddleware = require('./app/middlewares/checarTokenMiddleware')
//rotas API
const Categorias = require('./app/controllers/api/Categorias');


router.use(cors());




/* ---------------ROTAS APIS----------------- */

//ROTAS GET
router.get('/hello', (req, res) => {
    res.send('Hello World!');
  });
router.get('/categorias', Categorias.get);
router.get('/user/:id', checarTokenMiddleware,testeBuscarIdController.buscarId)
router.get('/produtos/:id_produto', produtos.get);
router.get('/produtos-home/:limite/:deslocamento', produtos.getProdutosHome); //exibir produtos na pagina inicial e com paginação


//ROTAS POST
router.post('/produtos', produtos.post);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/produtos-imagemcapa/:imageUrl', produtos.getImageCapa) // pega imagem de capa para exibir nos card de cada produto

module.exports = router;