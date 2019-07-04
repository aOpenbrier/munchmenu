const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000
const fs = require('fs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.put('/menu', (req, res) => {
    res.sendStatus(200)
    fs.writeFile('public/menu.json', JSON.stringify(req.body, null, 1), (e) => e && console.error(e))
})

app.listen(PORT, () => console.log(`listening at localhost:${PORT}`))