require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();

const whitelist = ['http://localhost:4200', 'https://tu-liga-front.herokuapp.com']

const corsOptions = {
    function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
 
// parse application/json
app.use(bodyParser.json())

// Global settings of the routes
app.use(require('./routes/index'))

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT);
})