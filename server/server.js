require('./config/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.get('/user', function (req, res) {
  res.json('Get user')
})

app.post('/user', function (req, res) {
    let user = req.body

    res.json({
        user
    })
})

app.put('/user/:id', function (req, res) {
    let id = req.params.id

    res.json({
        id,
        name: 'Daniel'
    })
})

app.delete('/user', function (req, res) {
    res.json('Delete user')
})
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT);
})