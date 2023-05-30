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