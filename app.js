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
mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

const port = 3000;
app.listen(port, () => {
  console.log(`sunucu ${port} portunda başlatıldı`);
});


