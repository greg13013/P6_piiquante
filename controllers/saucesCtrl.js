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

exports.likeSauces = async (req, res, next) => {

    console.log('---------------------------------------------')
    const idSauce = req.params.id;
    const etatLike = req.body.like;
    const userId = req.body.userId;

    let tabUsersLiked;
    let tabUsersDisliked;
    let totalLikes;
    let totalDislikes;

    //Récupération sauce et stockage like/dislike
    await Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            tabUsersLiked = sauce.usersLiked
            tabUsersDisliked = sauce.usersDisliked
            totalLikes = sauce.likes
            totalDislikes = sauce.dislikes
        });



        //Si like 
    if (etatLike === 1) {

        totalLikes++;
        tabUsersLiked.push(userId);


    }
    //Si user annule like ou dislike
    else if (etatLike === 0) {

        //Récupération de la position dans le tableau userID
        let posUserIdTabUsersLiked = tabUsersLiked.indexOf(userId)
        let posUserIdTabUsersDisliked = tabUsersDisliked.indexOf(userId)

        console.log(posUserIdTabUsersLiked)
        console.log(posUserIdTabUsersDisliked)

        //Suppression selon likes ou dislikess
        if (posUserIdTabUsersLiked !== -1) {
            tabUsersLiked.splice(posUserIdTabUsersLiked, 1);
            totalLikes--
        }

        if (posUserIdTabUsersDisliked !== -1) {
            tabUsersDisliked.splice(posUserIdTabUsersDisliked, 1);
            totalDislikes--
        }

    }


    //Si dislike
    else if (etatLike === -1) {
        totalDislikes++;
        tabUsersDisliked.push(userId);
    }

    console.log('tableau like ', tabUsersLiked);
    console.log('tableau dislike ', tabUsersDisliked);
    console.log('Like ', totalLikes);
    console.log('Dislike ', totalDislikes);

    //Met a jour la sauce avec les likes, dislikes et les tableaux likes/dislikes userID
    Sauce.updateOne({ _id: idSauce }, { likes: totalLikes, dislikes: totalDislikes, usersLiked: tabUsersLiked, usersDisliked: tabUsersDisliked }).then(
        (sauce) => {
            // console.log(sauce);
            res.status(201).json({
                message: 'Sauce update successfully!'
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
