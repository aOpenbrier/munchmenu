const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000
const fs = require('fs')
const axios = require('axios')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.put('/menu', (req, res) => {
    res.sendStatus(200)
    fs.writeFile(path.join(__dirname, 'menu', 'menu.json'), JSON.stringify(req.body, null, 1), (e) => e && console.error(e))
})

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, "menu", "menu.json"))
})

app.get('/munchthaimenu', (req, res) => {
    axios.get(`https://www.munchthai.com/assets/js/menu.json`)
        .then(r => {
            res.json(r.data)
        }).catch(e => console.log(e))
})

app.listen(PORT, () => console.log(`listening at localhost:${PORT}`))