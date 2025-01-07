// Import required packages and modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

// Import database models
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

// Configure view engine and middleware
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to attach user instance to every request
// This simulates authentication for development
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// Register routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// Define database relationships
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Cart.belongsTo(User);
Order.belongsTo(User);
User.hasOne(Cart);
User.hasMany(Product);
User.hasMany(Order);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// Initialize database and start server
sequelize
  .sync()
  .then(() => User.findByPk(1))
  .then(user => {
    // Create default user if none exists
    if (!user) {
      return User.create({ name: 'Max', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => user.createCart())
  .then(() => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
