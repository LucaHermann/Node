const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');

exports.getProducts = (req, res, next) => {
  Product.findAll({
    include: [
      {
        model: User,
        required: true,
      },
    ],
  })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.findAll().then(products => {
      const cartProducts = [];
      if (cart) {
        for (let product of products) {
          const cartProductData = cart.products.find(prod => prod.id === product.id);
          if (cartProductData) {
            cartProducts.push({ ...product, qty: cartProductData.qty });
          }
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      Cart.addProduct(prodId, product.price);
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      Cart.deleteProduct(prodId, product.price);
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};

exports.postUpdateCartQuantity = (req, res, next) => {
  const prodId = req.body.productId;
  const quantity = parseInt(req.body.quantity);

  if (quantity < 1) {
    return res.redirect('/cart');
  }

  Product.findByPk(prodId)
    .then(product => {
      Cart.updateQuantity(prodId, quantity, product.price);
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
    });
};
