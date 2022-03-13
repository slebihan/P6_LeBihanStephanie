require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose');
const path = require('path')
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');
const helmet = require('helmet')

const app = express()
app.use(express.json())

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use('/images',  express.static(path.join(__dirname,'images')))

app.use('/api/auth',userRoutes)
app.use('/api/sauces',saucesRoutes)

module.exports = app