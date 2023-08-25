const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//connect DB

mongoose.connect("mongodb://127.0.0.1:27017/pcat-test-db");

//create schema

const PhotoSchema = new Schema({
  title: String,
  description: String,
});

const Photo = mongoose.model("photo", PhotoSchema);

//create a photo
// Photo.create({
//   title: "photo title 1",
//   description: "photo description 31",
// });

//read a photo

// Photo.find({description: 'photo description 1'}).then(data => console.log(data));

//update foto

const id = "64e8c0b6fac6f29d0d3921fe";

// Photo.findByIdAndUpdate(id, {
//   title: "ahmetin mekanı",
//   description: "ahmet uzun 31",
// }).then((data) => console.log(data));

Photo.findByIdAndDelete(id).then((data) => console.log("foto silindi"));
