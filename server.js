const animeindo = require('./controller/animeindoController')
const express = require('express')
const router = express.Router()
const port = process.env.PORT || 3000
const app = express()
const bodyparser = require('body-parser')


app
    .use(bodyparser.json())
    .listen(port, () => {
        console.log("Running on port server http://localhost:" + port)
    })

app.get('/', animeindo.getData)
app.post('/getVideo', animeindo.getVideo)