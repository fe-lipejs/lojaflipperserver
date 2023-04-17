const jwt = require('jsonwebtoken');
const User = require('../models/User1');
const bcrypt = require('bcrypt')

//REGISTRO USUÁRIO
const authController = {
  register: async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    //validations
    if (!name) {
      return res.status(422).json({ msg: "O nome é obrigatório!" })
    }
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" })
    }
    if (!password) {
      return res.status(422).json({ msg: "O password é obrigatório!" })
    }
    //checar se o usuário existe
    const userExists = await User.findOne({ email: email }) // buscar no banco usuário que tem o email igual a variavel email
    if (userExists) {
      return res.status(422).json({ msg: "Por favor, utilize outro e-mail" })
    }

    //criar senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //criar usuário
    const user = new User({
      name,
      email,
      password: passwordHash
    })

    try {
      await user.save()
      res.status(201).json({ msg: "Usuário criado com sucesso!" })
    } catch (error) {
      console.log(error)
      res.status(500).json({ msg: "Houve um erro no servidor, tente novamente mais tarde" })
    }
  },

  //LOGIN
 login: async (req, res) => {
    const { email, password } = req.body
    //validação simples:
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" })
    }
    if (!password) {
      return res.status(422).json({ msg: "O password é obrigatório!" })
    }
    //chegar se o usuário existe:
    const user = await User.findOne({ email: email }) // buscar no banco usuário que tem o email igual a variavel email
    if (!user) {
      return res.status(404).json({ msg: `Usuário não encontrado!` })
    }
    //chegar se a senha dá match
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida!" })
    }

    try {
      const secret = process.env.SECRET
      const token = jwt.sign({ id: user._id }, secret)
      return res.status(201).json({ msg: `Autenticação realizada com sucesso!`, token })
    } catch (error) {
      console.log(error)
    }
  }
}
module.exports = authController;
