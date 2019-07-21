const axios = require('axios')
const fs = require('fs')
const path = require('path')

module.exports = (app) => {

    app.put('/menu', (req, res) => {
        fs.writeFile(path.join(__dirname, '..', 'publish', 'assets', 'js', 'menu.json'), JSON.stringify(req.body, null, 1), (e) => e && console.error(e))
        res.sendStatus(200)
    })

    app.get('/menu', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'publish', 'assets', 'js', 'menu.json'))
    })

    app.get('/munchthaimenu', (req, res) => {
        axios.get('https://www.munchthai.com/assets/js/menu.json')
            .then(r => {
                res.json(r.data)
            }).catch(e => console.log(e))
    })

}