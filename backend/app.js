const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next()
})

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    throw new HttpError('Could not find a route.', 404);
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res
        .status(error.code || 500)
        .json({message: error.message || 'An unknown error occcured'});
});

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected');
        app.listen(5000);
    })
    .catch((err) => {
        console.log(err);
    });
