const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator')

//ID généré automatiquement par mongoose, utilisateur avec email unique
const utilisateurSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

utilisateurSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Utilisateur', utilisateurSchema);