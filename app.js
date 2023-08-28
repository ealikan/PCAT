const express = require('express');
const fileUpload = require('express-fileupload');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const Photo = require('./models/Photo');
const fs = require('fs');
var methodOverride = require('method-override');
const { HTTPMethod } = require('http-method-enum')

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
  methodOverride('_method', { methods: [HTTPMethod.POST,HTTPMethod.GET, HTTPMethod.PUT, HTTPMethod.DELETE] }),
);

//Routes
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort({ dateCreated: -1 });
  res.render('index', {
    photos,
  });
});
app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/add', (req, res) => {
  res.render('add');
});
app.post('/photos', async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadImage.name;

  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({
    _id: req.params.id,
  });
  res.render('edit', {
    photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
  });

  res.redirect(`/photos/${req.params.id}`);
});

app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({_id:req.params.id})
  let deletedImage= __dirname+"/public"+photo.image
  fs.unlinkSync(deletedImage)
  await Photo.findByIdAndRemove(req.params.id)
  
  res.redirect("/")
});

const port = 3000;
app.listen(port, () => {
  console.log(`sunucu ${port} portunda başlatıldı`);
});
