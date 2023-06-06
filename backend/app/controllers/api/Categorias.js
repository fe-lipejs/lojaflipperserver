const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categoriaCollectionSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    categorias: {
        Masculino: [String],
        Feminino: [String]
    }
})
const categoriaCollection = mongoose.model('categorias', categoriaCollectionSchema)

const Categoria = {
    get: async (req, res) => {

        const documentId = '6477f6d97512d783326b2d6e';

        /* categoriaCollection.updateOne(
            { _id: documentId },
            {
                $push: {
                    'categorias.Masculino': ['Camisas', 'Calças', 'Calçados', 'Acessórios'],
                    'categorias.Feminino': ['Blusas', 'Saias', 'Calçados', 'Acessórios']
                }
            }
        )
            .then(result => {
                console.log('Valor inserido com sucesso no objeto Masculino:', result);
            })
            .catch(err => {
                console.error('Erro ao inserir valor no objeto Masculino:', err);
            });
 */

         const id = "641fa09478c66761f515511f";
        const categorias = await categoriaCollection.find({ })
        console.log(categorias[0].categorias)

        if (!categorias) {
            return res.status(404).json({ msg: "Usuário não encontrado!" })
        }
        try {
            res.status(200).json(categorias[0])
        } catch (error) {
            console.log('Usuário não encontrado')

        } 

    }
}

module.exports = Categoria;