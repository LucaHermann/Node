const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete', 'root', 'nodecomplete', {
  dialect: 'mysql',
  host: 'localhost',
  logging: console.log,
});

module.exports = sequelize;
