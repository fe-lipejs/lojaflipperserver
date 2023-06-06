const CarrinhoModel = require('../../models/Carrinho')
const produtoCollection = require('../../models/Produtos')



const Carrinho = {
    adicionarCarrinho: async (req, res) => {
        produtoCor = req.body[0].cor
        produtoNome = req.body[0].nome
        produtoTamanho = req.body[0].tamanho
        produtoId = req.body[0].id
       
        const dados = req.body[0]

        let carrinhoNovo = true

        produtoCollection.findOne({
            _id: req.body[0].id
        })
            .then(produto => {
                const corNoBD = produto.produtoEstoque.get(produtoCor);
                let tamanhoNoBD = '';
                let estoqueNoBD = '';
                //VERIFICAÇÃO SE A COR EXISTE 
                if (produto.produtoEstoque.has(produtoCor)) {
                    
                    const estoque = produto.produtoEstoque.get(produtoCor).estoque
                    for (let prop in estoque) {
                        if (estoque.hasOwnProperty(prop)) {
                            const stock = estoque[prop];
                            if (stock.tamanho == produtoTamanho && stock.quantidade) {
                                tamanhoNoBD = stock.tamanho;
                                //console.log('TAMANHO PRODUTO VINDO DO CLIENTE: '+produtoTamanho+', PRODUTO VINDO DO SERVIDOR: '+tamanhoNoBD)
                                estoqueNoBD = stock.quantidade;
                            }
                        }
                    }
                    //VERIFICAÇÃO SE O TAMANHO EXISTE
                    if (tamanhoNoBD == produtoTamanho) {
                        addCartDados()
                    }
                    else {
                        console.log('Não podemos adicionar no carrinho, porque não existe esse produto no meu estoque');
                    }
                } else {
                    console.log('Não podemos adicionar no carrinho, porque não existe esse produto no meu estoque');

                }

                function addCartDados(){

                    if(produto){
                        // Verifica se o array carrinho já existe na sessão
                        if (!req.session.carrinho) {
                            if(estoqueNoBD > 0){
                            req.session.carrinho = []
                            req.session.carrinho.push(dados);
                            req.session.save()
                            console.log("Carrinho adicionado")
                            }else{
                                console.log("Estoque máximo atingido ou estoque zerado")
                            }

                        } else {
                            for (let index = 0; index < req.session.carrinho.length; index++) {
                                const cart = req.session.carrinho[index];
                                if (req.session.carrinho[index].id == produtoId && req.session.carrinho[index].nome == produtoNome && req.session.carrinho[index].tamanho == produtoTamanho && req.session.carrinho[index].cor == produtoCor) {
                                    console.log("Carrinho existe, vou adicionar quantidade")
                                    if(estoqueNoBD > 0 && req.session.carrinho[index].quantidade < estoqueNoBD){
                                    req.session.carrinho[index].quantidade = req.session.carrinho[index].quantidade+1;
                                    req.session.save()
                                    }else{
                                        console.log("Estoque máximo atingido ou estoque zerado")
                                    }
                                    carrinhoNovo = false
                                }
                            }
                            if (carrinhoNovo == true) { //Se o carrinho existe ele terá false, porem se for true quer dizer que alguns ou todos os dados são novos
                                console.log("Carrinho novo, vou adicionar nova informação, carrinho é novo? ", carrinhoNovo)
                                req.session.carrinho.push(dados);
                                req.session.save()

                            }
                            console.log(req.session.carrinho.length);

                        }
                    }else{
                        console.log("Não existe esse item no banco de dados")
                    } 
                }

            })
            .catch(err => {
                console.log('Ops! Houve um erro:  ', err);
            });
    
        res.send("ok")
    },

    get: async (req, res) => {

        console.log('Os dados da sessão são: ', req.session.carrinho)
        /*   CarrinhoModel.find({})
              .then(carrinho => {
                  res.status(200).send(carrinho);
              })
              .catch(err => {
                  console.log(err);
              });
   */
        res.status(201).json(req.session.carrinho);
        //console.log(req.session.carrinho);

    },
    post: async (req, res) => {
        console.log(req.body);
        req.session.carrinho = 123

        //res.send(req.session.carrinho);
        res.status(201).json({ mensagem: req.session.carrinho });

        //colocar o if caso o estoque for vazio nao acrescentar no carrinho

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