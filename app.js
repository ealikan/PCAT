const express = require('express');
const fileUpload = require('express-fileupload');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const Photo = require('./models/Photo');
const fs = require('fs');
var methodOverride = require('method-override');
const { HTTPMethod } = require('http-method-enum');
const photoController = require('./controllers/photoControllers');
const pageController = require('./controllers/pageController');

const app = express();

//connect DB
mongoose
  .connect(
    'mongodb+srv://ethemfiratalikan:Df78v5b5.@cluster0.iy3z8rn.mongodb.net/pcat-db?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log('dbconnected!');
  })
  .catch((err) => {
    console.log(err);
  });

//Template Engine
app.set('view engine', 'ejs');

//middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  methodOverride('_method', {
    methods: [
      HTTPMethod.POST,
      HTTPMethod.GET,
      HTTPMethod.PUT,
      HTTPMethod.DELETE,
    ],
  }),
);

//Routes

app.post('/photos', photoController.createPhoto);

app.get('/', photoController.getAllPhotos);

app.get('/photos/:id', photoController.getPhoto);

app.put('/photos/:id', photoController.updatePhoto);

app.delete('/photos/:id', photoController.deletePhoto);

app.get('/about', pageController.getAboutPage);

app.get('/add', pageController.getAddPage);

app.get('/photos/edit/:id', pageController.getEditPage);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`sunucu ${port} portunda başlatıldı`);
});
