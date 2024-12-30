const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
  constructor() {
    this.products = [];
    this.totalPrice = 0;
  }

  static addProduct(id, productPrice) {
    // Read the file first
    fs.readFile(p, (err, fileContent) => {
      // Initialize cart with default structure
      let cart = new Cart();

      // Only try to parse if file exists and has content
      if (!err && fileContent.length > 0) {
        try {
          const parsedCart = JSON.parse(fileContent);
          cart.products = parsedCart.products || [];
          cart.totalPrice = parsedCart.totalPrice || 0;
        } catch (error) {
          console.log('Error parsing cart:', error);
          // Continue with empty cart if parsing fails
        }
      }

      // Find existing product
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      // Update total price to include the new product
      cart.totalPrice = cart.totalPrice + +productPrice;

      // Write the updated cart back to file
      fs.writeFile(p, JSON.stringify(cart), err => {
        if (err) {
          console.log('Error writing cart:', err);
        }
      });
    });
  }
};
