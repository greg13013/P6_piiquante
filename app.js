const express = require('express');
const mongoose = require('mongoose');

const app = express();

// const Sauce = require('./models/sauces')
// const Utilisateur = require('./models/utilisateurs')

app.use(express.json());

//   srv://<user:mdp>
mongoose.connect('mongodb+srv://piiquante:mdppiiquante@cluster0.0o5ap.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

const sauceRoutes = require('./routes/saucesRoutes');
const utilisateurRoutes = require('./routes/utilisateursRoutes');

app.use('/api/sauces', sauceRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);


module.exports = app;