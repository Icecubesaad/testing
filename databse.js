require('dotenv').config();
const mongoose = require("mongoose");
const url = " mongodb+srv://icecube:hehewtf123@icecubeblogapp.blxfsng.mongodb.net/Blogs";
const connection = () => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to database!');
      // your code here
    })
    .catch((error) => {
      console.error('Error connecting to database:', error);
    });
}
module.exports = connection;
