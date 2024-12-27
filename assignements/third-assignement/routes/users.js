const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('In the users middleware');
  res.sendFile(path.join(__dirname, '../views', 'users.html'));
});

module.exports = router;
