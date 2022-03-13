//Récupération du modèle de la sauce //
const Sauce = require('../models/sauces');
// Intégration de fs pour intéragir avec le file-système //
const fs = require('fs')

//Fonction pour obtenir sur la page toutes les sauces //
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

//Fonction pour l'affichage d'une seule sauce //

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

// Fonction pour la création d'une nouvelle sauce //

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked :[],
    usersDisliked : []
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour la modification de sauce //

exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...req.body }

  Sauce.updateOne({ _id : req.params.id}, {...sauceObject, _id: req.params.id})
  .then(res.status(200).json({ message : "Sauce modifiée"}))
  .catch(error => res.status(400).json({ error }))
}

// Fonction pour la suppression de sauce //

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id : req.params.id})
  .then(sauce => {
    const filename = sauce.imageUrl.split("/images/")[1]

    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({_id : req.params.id})
  .then(res.status(200).json({ message: "Sauce supprimée" }))
  .catch(error => res.status(400).json({ error }))
    })
  })
}

//Fonction permettant à l'utilisateur de liker ou non une sauce //

exports.likeOrNot = (req,res,next) =>{

let like = req.body.like
let userId = req.body.userId
let sauceId = req.params.id

  if(like === 1) { // Option like
      Sauce.updateOne({_id: sauceId}, { $inc: { likes: 1}, $push: { usersLiked: userId}, _id: sauceId})
      .then( () => res.status(200).json({ message: "j'aime cette sauce !" }))
      
      .catch( error => res.status(400).json({ error}))
  } else if(like === -1) { // Option dislike
      Sauce.updateOne({_id: sauceId}, { $inc: { dislikes: 1}, $push: { usersDisliked: userId}, _id: sauceId })
      .then( () => res.status(200).json({ message: "Je n'aime pas cette sauce !" }))
      .catch( error => res.status(400).json({ error}))
  }
  else {    // Annuler like ou dislike
    Sauce.findOne( {_id: sauceId})
    .then( sauce => {
        if( sauce.usersLiked && like === 0 ){
             Sauce.updateOne({_id: sauceId}, { $inc: { likes: -1},$pull: { usersLiked: userId}, _id: sauceId})
            .then( () => res.status(200).json({ message: " like retiré !" }))
            .catch( error => res.status(400).json({ error}))
            }
        else if( sauce.usersDisliked && like === 0) {
     
            Sauce.updateOne( {_id: sauceId}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId}, _id: sauceId})
            .then( () => res.status(200).json({ message: " don't like retiré !" }))
            .catch( error => res.status(400).json({ error}))
            }           
    })
    .catch( error => res.status(400).json({ error}))             
}   
}


