const express = require('express');
const bodyParser = require('body-parser')
const port = 3000
const users = require('./api/user')
const worlds = require('./api/world')
const npc = require('./api/npc')
const cors = require('cors')
const item  =require('./api/item')

const app = express();
app.use(cors())

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

app.use('/api/v1/users', users);
app.use('/api/v1/world', worlds);
app.use('/api/v1/npc', npc);
app.use('/api/v1/item', item);

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get(`env`) === `development` ? err : {};

    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get(`env`) === `development` ? err : {}
    })
})



module.exports = app