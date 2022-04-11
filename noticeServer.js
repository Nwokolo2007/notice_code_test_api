const express =  require('express');
const bodyParser =  require('body-parser');
const mongoose = require('mongoose');

const noticeRoutes = require('./routes/noticeRoutes');
const authRoute =  require('./routes/auth');
const mongoConnect = require('./core/database/database');
const app = express();

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0.i7iis.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use(noticeRoutes);
app.use(authRoute);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });


  mongoose
  .connect(MONGODB_URI)
  .then(result => {
      app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });
 
