const produtoCollection = require('../../models/Produtos')
const multer = require('multer')
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
//const FormData = require('formidable').FormData;
const FormData = require('form-data');
const converBase64toImage = require('convert-base64-to-image');
const { log } = require('console');


async function saveProductImageInStorage(id, nomeProduto, categoria, subcategoria, corVariacao, imagem, imagemName) {
    //public storage/public/id/variacoes/
    // Create Variable with Base64 Image String
    const nomeProdutoMinusculo = nomeProduto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_").toLowerCase();

    const dir = '../../../public/produtos/' + categoria + '/' + (subcategoria ? subcategoria + '/' : '') + id + '$' + nomeProdutoMinusculo + '/' + corVariacao + '/';

    if (imagem && await imagem.includes('data:image/png;base64')) {
        const base64Data = imagem.replace('data:image/png;base64', '');

        // subcategoria ? subcategoria+'/' : '' | operador ternário é o nome disso kk

        const imagemNameAndExtension = imagemName + '.png'
        const imagePath = path.join(__dirname, dir, imagemNameAndExtension);
        const dirPath = path.dirname(imagePath);
        console.log(nomeProdutoMinusculo)
        const srcImagemBancoDeDados = categoria + '/' + (subcategoria ? subcategoria + '/' : '') + id + '$' + (nomeProdutoMinusculo) + '/' + corVariacao + '/' + imagemNameAndExtension;

        if (!fs.existsSync(dirPath)) {
            // Se não existe, cria o diretório
            fs.mkdirSync(dirPath, { recursive: true });
        }

        await fs.writeFile(imagePath, base64Data, 'base64', function () { })



        //Salva o endereço no banco de dados:
        produtoCollection.findOneAndUpdate(
            { _id: id },
            { $set: { [`produtoEstoque.${corVariacao}.imagens.${imagemName}`]: srcImagemBancoDeDados } },
            { new: true, useFindAndModify: false }
        )
            .then(produtoAtualizado => {
                console.log('Produto atualizado com sucesso:', produtoAtualizado);
            })
            .catch(err => console.error(err));
        //---------------------------------------------------------------

    }
    else if (imagem && await imagem.includes('data:image/jpeg;base64')) {
        const base64Data = imagem.replace('data:image/jpeg;base64', '');

        const imagemNameAndExtension = imagemName + '.jpg'
        const imagePath = path.join(__dirname, dir, imagemNameAndExtension);
        const dirPath = path.dirname(imagePath);
        const srcImagemBancoDeDados = categoria + '/' + (subcategoria ? subcategoria + '/' : '') + id + '_' + (nomeProdutoMinusculo) + '/' + corVariacao + '/' + imagemNameAndExtension;

        if (!fs.existsSync(dirPath)) {
            // Se não existe, cria o diretório
            fs.mkdirSync(dirPath, { recursive: true });
        }

        await fs.writeFile(imagePath, base64Data, 'base64', function () { })



        //Salva o endereço no banco de dados:
        produtoCollection.findOneAndUpdate(
            { _id: id },
            { $set: { [`produtoEstoque.${corVariacao}.imagens.${imagemName}`]: srcImagemBancoDeDados } },
            { new: true, useFindAndModify: false }
        )
            .then(produtoAtualizado => {
                console.log('Produto atualizado com sucesso:', produtoAtualizado);
            })
            .catch(err => console.error(err));
        //---------------------------------------------------------------



    } else {

        console.log("Tipo de arquivo não aceito ou erro no carregamento da imagem: ", imagemName)
    }
}
const produtos = {
    get: async (req, res) => {
        const id_produto = req.params.id_produto
        //chegar se usuário existe
        const produto = await produtoCollection.findById(id_produto) // para segurança, todos os dados do usuário irão ser exibidos, execeto a senha

        if (!produto) {
            return res.status(404).json({ msg: "Produto não encontrado!" })
        }


        try {
            res.status(200).json(produto)
        } catch (error) {
            console.log('Produto não encontrado')

        }
    },
    post: async (req, res) => {
        const produto = req.body
        var produtoEstoqueObj = {};
        var produtoEstoqueComImagensObj = {};
        var idProduto = '';

        //-----CAPTAR O ESTOQUE E SALVAR NUMA VARIÁVEL-----
        for (let i = 0; i < produto[1].length; i++) {
            const produtoEstoque = produto[1][i];

            const imagens = {
                'imgCapa': produtoEstoque.imgCapa,
                'img1': produtoEstoque.img1,
                'img2': produtoEstoque.img2,
                'img3': produtoEstoque.img3,
                'img4': produtoEstoque.img4
            };



            Object.assign(produtoEstoqueObj, {
                [produtoEstoque.cor]: {
                    hex: produtoEstoque.hex,
                    imagens: {},
                    estoque: {}
                }
            })
            Object.assign(produtoEstoqueComImagensObj, {
                [produtoEstoque.cor]: {
                    hex: produtoEstoque.hex,
                    imagens: imagens,
                    estoque: {}
                }
            })



            for (let y = 0; y < produtoEstoque.variacoes.length; y++) {
                const produtoEstoqueVariacao = produtoEstoque.variacoes[y];

                const produtoVariacaoObj = {
                    tamanho: produtoEstoqueVariacao.tamanho,
                    quantidade: produtoEstoqueVariacao.estoque
                };
                Object.assign(produtoEstoqueObj[produtoEstoque.cor].estoque, {
                    [y]: {
                        tamanho: produtoEstoqueVariacao.tamanho,
                        quantidade: produtoEstoqueVariacao.estoque
                    }
                })

            }



        }
        //--------------------------------------------------


        //-------VARIÁVEIS PRODUTO  BANCO DE DADOS------------

        categoria = produto[0][0].categoria_;
        subcategoria = produto[0][0].subcategoria;
        nome = produto[0][0].nome;
        sku = produto[0][0].sku;
        preco = produto[0][0].preco;
        descricao = produto[0][0].descricao;
        precoPromocional = produto[0][0].precoPromocional;
        produtoEstoque = produtoEstoqueObj;


        //------------Salvar no Banco de Dados----------

        const produtosTable = new produtoCollection({
            categoria: categoria,
            subcategoria: subcategoria,
            nomeProduto: nome,
            sku: sku,
            precoPromocional: precoPromocional,
            preco: preco,
            descricao: descricao,
            produtoEstoque: produtoEstoque,

        });




        produtosTable.save()
            .then((doc) => {
                // console.log('Documento salvo com sucesso, ID: ', doc);
                idProduto = doc._id;

                try {
                    //Criando o processamento de imagem para cada indíce do array salvar as imagens correspondentes.
                    // produtoIDorName/azul/

                    //Pega as chaves dos objetos contidos no array produtoEstoque, que no caso são as cores e criar um array, porque nesse array as chaves não são numerais, por isso não consigo pegar
                    const keysProdutoEstoque = Object.keys(produtoEstoque).map(function (keyProdutoEstoque) {
                        return keyProdutoEstoque;
                    });

                    for (let index = 0; index < keysProdutoEstoque.length; index++) {
                        const cor = keysProdutoEstoque[index];

                        const produtoNome = nome

                        const imgCapa = produtoEstoqueComImagensObj[cor].imagens.imgCapa
                        const img1 = produtoEstoqueComImagensObj[cor].imagens.img1
                        const img2 = produtoEstoqueComImagensObj[cor].imagens.img2
                        const img3 = produtoEstoqueComImagensObj[cor].imagens.img3
                        const img4 = produtoEstoqueComImagensObj[cor].imagens.img4

                        //Salva as imagens de acordo com as variacoes
                        saveProductImageInStorage(idProduto, produtoNome, categoria, subcategoria, cor, imgCapa, 'imgCapa')
                        saveProductImageInStorage(idProduto, produtoNome, categoria, subcategoria, cor, img1, 'img1')
                        saveProductImageInStorage(idProduto, produtoNome, categoria, subcategoria, cor, img2, 'img2')
                        saveProductImageInStorage(idProduto, produtoNome, categoria, subcategoria, cor, img3, 'img3')
                        saveProductImageInStorage(idProduto, produtoNome, categoria, subcategoria, cor, img4, 'img4')
                    }
                    const data = { produto_id: idProduto };
                    res.status(200).json(data);
                } catch (error) {
                    const data = { message: 'Erro ao salvar dados no servidor!', error };
                    res.status(501).json(data)
                    console.log('OPS, houve um erro: ', error)
                }


            })
            .catch((err) => {
                console.error('Erro ao salvar o documento:', err);
            });
        // --------------------CRIACAO DE IMAGENS------------

        //const data = { id: 'Dados salvos com sucesso!' };
        // res.status(200).json(data);









    },
    getProdutosHome: async (req, res) => {
        const limite = parseInt(req.params.limite) || 10;
        const deslocamento = parseInt(req.params.deslocamento) || 0;
        console.log("limite: ", limite)
        console.log("deslocamento: ", deslocamento)


        produtoCollection.find()
            .skip(deslocamento)
            .limit(limite)
            .exec()
            .then((produtos) => {
                const resultadosProdutos = produtos

                //produtoCollection.countDocuments({ preco: { $gt: 10 } }) // Observe que o objeto de consulta { preco: { $gt: 10 } } é passado como argumento para o método countDocuments(). Esse objeto de consulta instrui o Mongoose a contar apenas os documentos que têm o campo preco maior do que 10.
                produtoCollection.countDocuments()
                    .then((count) => {

                        // envia os resultados para o Vue.js
                        enviarResposta(resultadosProdutos, count)
                    })
                    .catch((err) => {
                        console.error(err);
                        return;
                    });

            })
            .catch((err) => {
                console.error(err);
                return;
            });



        function enviarResposta(resultadosProdutos, numeroResultadosProdutos) {
            res.status(201).json({ produtos: resultadosProdutos, numeroResultados: numeroResultadosProdutos });
        }

    },
    getImageCapa: async (req, res) => {

        const imagePath = path.join(__dirname, '../../../public', 'produtos', req.params.imageUrl)
        res.download(imagePath);
        console.log(imagePath)

    },

}

module.exports = produtos;



















