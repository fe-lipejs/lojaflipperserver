const User = require('../models/User1');

exports.buscarId = async (req, res) => {
    const id = req.params.id
     //chegar se usuário existe
    const user = await User.findById(id, '-password') // para segurança, todos os dados do usuário irão ser exibidos, execeto a senha

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" })
    }
    
    
    try {
        res.status(200).json( user.nome)
    } catch (error) {
        console.log('Usuário não encontrado')
        
    }
}
