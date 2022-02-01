const express = require('express');
const mongoose = require('mongoose');

//Sécurités
const toobusy = require ('toobusy-js');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const app = express();

const path = require('path');

// middleware qui bloque les requetes quand surchargé
app.use(function(req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  }
});

//Limite le flood du même utilisateur (IP)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Applique une limitation pour les requêtes
app.use(limiter)

//Vérifie les parametres de la requete
app.use(hpp());

app.use(express.json());

//Connexion mongoDB  =>   srv://<user:mdp>
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

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', utilisateurRoutes);


module.exports = app;