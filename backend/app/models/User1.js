const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre('save', function (next) {
  const user = this;
  console.log(this)
  if (!user.isModified('password')) {
    return next();
    /* 
    Se a senha fosse modificada e o código não fizesse essa verificação, ele executaria a lógica de criptografia 
    ou validação da senha sempre que a operação de salvar fosse executada, 
    mesmo que a senha não tivesse sido alterada. Isso poderia aumentar a carga de processamento 
    do servidor e diminuir o desempenho da aplicação.

    Além disso, a verificação se a senha foi modificada é importante para garantir que a senha seja 
    criptografada ou validada somente quando necessário. Se a senha já foi criptografada ou validada
    em uma operação anterior, não há necessidade de fazer isso novamente.
    */
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;