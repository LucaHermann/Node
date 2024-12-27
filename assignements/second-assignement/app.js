const express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
  console.log('In the users middleware');
  res.send('<h1>Hello from Users!</h1>');
});

app.use('/', (req, res, next) => {
  console.log('In the middleware');
  res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);
