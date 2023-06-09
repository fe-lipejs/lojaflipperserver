const CarrinhoModel = require('../../models/Carrinho')
const produtoCollection = require('../../models/Produtos')



const Carrinho = {
    adicionarCarrinho: async (req, res) => {
        try {
            const produtoCor = req.body[0].cor;
            const produtoNome = req.body[0].nome;
            const produtoTamanho = req.body[0].tamanho;
            const produtoId = req.body[0].id;
            console.log("Adicionar Carrinho");
    
            const dados = req.body[0];
    
            let carrinhoNovo = true;
    
            const produto = await produtoCollection.findOne({ _id: req.body[0].id });
    
            if (produto) {
                const corNoBD = produto.produtoEstoque.get(produtoCor);
                let tamanhoNoBD = '';
                let estoqueNoBD = '';
    
                if (produto.produtoEstoque.has(produtoCor)) {
                    const estoque = produto.produtoEstoque.get(produtoCor).estoque;
    
                    for (let prop in estoque) {
                        if (estoque.hasOwnProperty(prop)) {
                            const stock = estoque[prop];
    
                            if (stock.tamanho == produtoTamanho && stock.quantidade) {
                                tamanhoNoBD = stock.tamanho;
                                estoqueNoBD = stock.quantidade;
                            }
                        }
                    }
    
                    if (tamanhoNoBD == produtoTamanho) {
                        addCartDados();
                    } else {
                        console.log('Não podemos adicionar no carrinho, porque não existe esse produto no meu estoque');
                    }
                } else {
                    console.log('Não podemos adicionar no carrinho, porque não existe esse produto no meu estoque');
                }
    
                function addCartDados() {
                    // Verifica se o array carrinho já existe na sessão
                    if (!req.session.carrinho) {
                        if (estoqueNoBD > 0) {
                            req.session.carrinho = [];
                            req.session.carrinho.push(dados);
                            req.session.save();
    
                            console.log("Carrinho sessão adicionado");
                            console.log("Carrinho adicionado:", req.session.carrinho);
                        } else {
                            console.log("Estoque máximo atingido ou estoque zerado");
                        }
                    } else {
                        for (let index = 0; index < req.session.carrinho.length; index++) {
                            const cart = req.session.carrinho[index];
                            if (req.session.carrinho[index].id == produtoId && req.session.carrinho[index].nome == produtoNome && req.session.carrinho[index].tamanho == produtoTamanho && req.session.carrinho[index].cor == produtoCor) {
                                console.log("Carrinho existe, vou adicionar quantidade");
                                if (estoqueNoBD > 0 && req.session.carrinho[index].quantidade < estoqueNoBD) {
                                    req.session.carrinho[index].quantidade = req.session.carrinho[index].quantidade + 1;
                                    req.session.save();
                                    console.log("Carrinho sessão adicionado 2");
                                } else {
                                    console.log("Estoque máximo atingido ou estoque zerado");
                                }
                                carrinhoNovo = false;
                            }
                        }
    
                        if (carrinhoNovo == true) {
                            console.log("Carrinho novo, vou adicionar nova informação, carrinho é novo? ", carrinhoNovo);
                            req.session.carrinho.push(dados);
                            req.session.save();
                        }
    
                        console.log(req.session.carrinho.length);
                    }
                }
            } else {
                console.log("Não existe esse item no banco de dados");
            }
    
            res.status(201).json(req.session.carrinho);
        } catch (error) {
            console.error('Ops! Houve um erro:', error);
            res.status(500).send("Erro ao adicionar carrinho");
        }
    },
    

    get: async (req, res) => {
        console.log(req.params);
        console.log('Os dados da sessão são: ', req.session.carrinho)
       
        res.status(201).json(req.session.carrinho);


    },
    post: async (req, res) => {
        console.log(req.body);
        req.session.carrinho = 123

        //res.send(req.session.carrinho);
       
        //colocar o if caso o estoque for vazio nao acrescentar no carrinho

    },
    put: async (req, res) => {
        console.log('put')
    },
    delete: async (req, res) => {
       console.log("ID :",req.params)
       if(req.session.carrinho){
          req.session.carrinho.forEach((produto, index) => {
            if (produto.id === req.params.id && produto.tamanho === req.params.tamanho && produto.cor === req.params.cor) {
              req.session.carrinho.splice(index, 1);
              req.session.save()
            }
          }); 
        } 
        res.status(201).json( req.session.carrinho );
 
          

    }
}

module.exports = Carrinho;