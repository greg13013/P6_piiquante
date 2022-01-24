const Sauce = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceBody = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        userId: sauceBody.userId,
        name: sauceBody.name,
        manufacturer: sauceBody.manufacturer,
        description: sauceBody.description,
        mainPepper: sauceBody.mainPepper,
        heat: sauceBody.heat,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Sauce saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

function deleteFichier(id) {
    Sauce.findOne({ _id: id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => { });
        })
}

exports.modifySauce = async (req, res, next) => {
    req.file ? deleteFichier(req.params.id) : null;

    var sauceOwner = false

    const sauce = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : {
        ...req.body
    }

    //Verification si c'est le propriétaire de la sauce
    await Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            if (!sauce) {
                res.status(404).json({
                    error: 'Aucune sauce'
                });
            }
            if (sauce.userId !== req.auth.userId) {

                res.status(401).json({
                    error: 'Mauvais propriétaire'
                });
            } else {
                sauceOwner = true;
            }
        });

        // Si oui modif possible
    if (sauceOwner) {

        await Sauce.updateOne({ _id: req.params.id }, sauce).then(
            () => {
                res.status(201).json({
                    message: 'Sauce updated successfully!'
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
    }
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    // res.status(200).json({message: 'tsst'})
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};