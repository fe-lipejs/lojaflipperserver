const CarrinhoModel = require('../../models/Carrinho')



const Carrinho = {
    adicionarCarrinho: async (req, res) => {
        console.log('resposta: ')
        console.log(req.body[0])
        const carrinhoArray = req.body; // Supondo que o array esteja dentro da chave 'carrinho' em req.body

        //Verificar se já existe o ID, caso sim apenas irá adicionar +1 ao valor quantidade, caso contrário irá apenas criar um novo 
        CarrinhoModel.findOne({
            id: req.body[0].id,
            cor: req.body[0].cor,
            tamanho: req.body[0].tamanho
        })
            .then(carrinho => {
                if (carrinho) {
                    if (carrinho.estoqueProduto == 0 || req.body[0].quantidade > carrinho.estoqueProduto) {
                        console.log("Não pode adicionar acima da quantidade armazenada no estoque: ")
                    } else {
                        CarrinhoModel.findOneAndUpdate(
                            {
                                id: req.body[0].id,
                                cor: req.body[0].cor,
                                tamanho: req.body[0].tamanho
                            },
                            { $inc: { quantidade: +1 } }, /* $inc soma/incrementar um valor, $set atualiza o valor */
                            { new: true }
                        )
                            .then(carrinhoAtualizado => {
                                res.send('Carrinho atualizado com sucesso!');
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                } else {
                    console.log(carrinho)
                    CarrinhoModel.insertMany(carrinhoArray)
                        .then((x) => {
                            console.log(x)
                            res.send('Carrinho salvo com sucesso!');
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch(err => {
                console.log(err);
            });

        /*  const novoCarrinho = new CarrinhoModel(
             [req.body]
         );
         novoCarrinho.save()
             .then(() => {
                 res.send('Carrinho salvo com sucesso!');
             })
             .catch((err) => {
                 console.log(err);
             }); */
    },
    get: async (req, res) => {

        CarrinhoModel.find({})
            .then(carrinho => {
                res.status(200).send(carrinho);
            })
            .catch(err => {
                console.log(err);
            });



    },
    post: async (req, res) => {
        console.log(req.body);
        req.session.carrinho = 123
        //res.send(req.session.carrinho);
        res.status(201).json({ mensagem: req.session.carrinho });


        /*  res.cookie('meuCookie', 'valorDoCookie', {
             expires: new Date(Date.now() + 900000),
             sameSite: 'strict',
             httpOnly: true,
             secure: true,
             domain: '.127.0.0.1',
         });
         res.send('Cookie definido');
 */


    },
    put: async (req, res) => {
        console.log('put')
    },
    delete: async (req, res) => {
        const _id = req.params._id;
      

        CarrinhoModel.findOneAndDelete({ _id: _id })
            .then(carrinho => {
                CarrinhoModel.find({})
                    .then(carrinhoAll => {
                       // console.log("-----------Carrinho no DELETE:---------",carrinhoAll.imagem);
                        res.status(200).send(carrinhoAll);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });

    }
}

module.exports = Carrinho;