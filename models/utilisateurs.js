const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator')

//ID généré automatiquement par mongoose
const utilisateurSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

utilisateurSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Utilisateur', utilisateurSchema);