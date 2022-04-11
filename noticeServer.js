const express =  require('express');
const bodyParser =  require('body-parser');
const mongoose = require('mongoose');

const noticeRoutes = require('./routes/noticeRoutes');
const authRoute =  require('./routes/auth');
const mongoConnect = require('./core/database/database');
const app = express();

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
  .connect(
    'mongodb+srv://notice:ciNxnphI6cifMjVc@cluster0.i7iis.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));