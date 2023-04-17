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

/* ROTAS API get*/
router.get('/categorias', Categorias.get);
router.get('/produtos', produtos.get);
/* ROTAS API post */
router.post('/produtos', produtos.post);



/* ROTAS NORMAIS */
//ROTAS GET
router.get('/hello', (req, res) => {
    res.send('Hello World!');
  });
router.get('/user/:id', checarTokenMiddleware,testeBuscarIdController.buscarId)


//ROTAS POST
router.post('/produtos', produtos.post);
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;