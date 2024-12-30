const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const productsFilePath = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
  fs.readFile(productsFilePath, (err, fileContent) => {
    let products = [];
    if (!err && fileContent.length > 0) {
      try {
        products = JSON.parse(fileContent);
      } catch (parseError) {
        console.error('Error parsing products.json:', parseError);
      }
    }
    cb(products);
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
        if (err) {
          console.error('Error writing to products.json:', err);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
