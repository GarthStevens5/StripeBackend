require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World! 🌈'
  });
});

app.post('/accept-payment', (req, res) => {
  console.log(process.env.STRIPE_SECRET_KEY);
  
  const token = req.body.stripeToken;
  const amount = req.body.amount;

  const charge = stripe.charges.create({
    amount,
    currency: 'usd',
    description: 'Example charge',
    source: token,
  });
  charge.then(result => {
    res.json(result)
  })
  .catch(err => {
    const error = {
      message: err.message,
      failure_code: err.code || 500
    }
    res.json(error);
  });
});

app.use((req, res, next) => {
  res.status(404);
  const error = new Error('Not Found. 🔍');
  next(error);
});

app.use((error, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
    error: error.stack
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});