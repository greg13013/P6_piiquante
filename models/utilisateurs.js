const mongoose = require('mongoose');

//ID généré automatiquement par mongoose
const utilisateurSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);