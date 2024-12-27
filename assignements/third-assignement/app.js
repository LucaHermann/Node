const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const usersRoutes = require('./routes/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Root route now serves index.html instead of redirecting
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use('/users', usersRoutes);

app.use((req, res) => {
  res.status(404).send('<h1>Page not found</h1>');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
