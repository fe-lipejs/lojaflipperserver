//MIDDLEWARE
const checkToken = (req,res,next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1] /* Verifica se veio algo em authHeader, se sim, o split
    irá dividir o que tá escrito na variável pelo o espaço " " e pegar o segundo item "[1]" */
  
    if(!token){
      return res.status(401).json({msg: "Acesso negado!"})
    }
  
    try {
      const secret = process.env.SECRET
      jwt.verify(token,secret)
      next()
    } catch (error) {
      return res.status(400).json({msg: "Token inválido"})
      
    }
  }

  module.exports = checkToken