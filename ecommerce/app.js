const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');

// import routes
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');

// app
const app = express();

// db connection
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then(() => console.log('DB Connected'));
mongoose.connection.on('error', (err) => {
  console.log(`DB connection error: ${err.message}`);
});

// middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', braintreeRoutes);
app.use('/api', orderRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
