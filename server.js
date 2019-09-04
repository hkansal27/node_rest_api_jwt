const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')

const users = require('./routes/user')
const movies = require('./routes/movie')

const mongoose = require('./config/database');
var jwt = require('jsonwebtoken')

const app = express();

app.set('secretKey', 'nodeRestApis')
mongoose.connect('mongodb://127.0.0.1:27017/node_rest_api');
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.json({ 'message': 'Restful apis with NodeJs' })
})


// public route
app.use('/users', users);
// private route
app.use('/movies', validateUser, movies);

app.get('/favicon.ico', function (req, res) {
    res.sendStatus(204);
});

function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), (err, decoded) => {
        if (err)
            res.json({ message: 'Error' })
        else {
            req.body.userId = decoded.id;
            next();
        }
    })
}

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(function (err, req, res, next) {
    console.log(err);

    if (err.status === 404)
        res.status(404).json({ message: "Not found" });
    else
        res.status(500).json({ message: "Something looks wrong :( !!!" });
});

app.listen(3000, () => {
    console.log('Server listening at port 3000')
})