const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');

// Fetch all products with their associated user data
exports.getProducts = (req, res, next) => {
  Product.findAll({
    include: [{ model: User, required: false }],
  })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch(err => next(err));
};

// Get single product details
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
    .catch(err => next(err));
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
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts();
    })
    .then(products => {
      const mappedProducts = products.map(product => ({
        ...product.dataValues,
        qty: product.cartItem.quantity,
      }));

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: mappedProducts,
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// Handle adding products to cart with quantity management
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let productToAdd;
  let newQuantity = 1;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      // Check if product already exists in cart
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      if (products.length > 0) {
        // If product exists, increment quantity
        productToAdd = products[0];
        newQuantity = productToAdd.cartItem.quantity + 1;
        return productToAdd;
      }
      // If product doesn't exist, fetch it from database
      return Product.findByPk(prodId);
    })
    .then(product => {
      productToAdd = product;
      return fetchedCart.addProduct(productToAdd, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => res.redirect('/cart'))
    .catch(err => next(err));
};

exports.postDeleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

// Create order from cart items
exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          // Transform cart items into order items with quantities
          const updatedProducts = products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          });
          return order.addProducts(updatedProducts);
        })
        .then(() => fetchedCart.setProducts(null)); // Empty cart after order creation
    })
    .then(() => res.redirect('/orders'))
    .catch(err => next(err));
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
