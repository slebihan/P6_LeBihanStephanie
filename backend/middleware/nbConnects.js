const expressLimit = require("express-rate-limit");

//Nombre maximum de connexions autorisées
const maximumAttempts = expressLimit({
    //délai en millisecondes
    windowMs: 30 * 60 * 1000,
    //tentatives de connexions autorisées
    max: 3,
    
    message:
        "Votre compte est bloqué pendant quelques minutes suite aux tentatives de connexions échouées !",
    
    });

module.exports = maximumAttempts;

