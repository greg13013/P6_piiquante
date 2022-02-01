const jwt = require('jsonwebtoken');

//Vérifie si l'utilisateur utilise le bon token et stock l'userId dans une variable req.auth
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    req.auth = {userId};
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch (e) {
    err = new Error ('Invalid request');
    res.status(401).json({
      erreur: e.toString(),
      error: err.toString()
    });
    throw err;
  }
};