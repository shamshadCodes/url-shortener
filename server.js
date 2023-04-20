const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb://127.0.0.1/urlShortener', {
    useNewUrlParser: true
})
const db = mongoose.connection

db.on('error', error => console.log("Something went wrong \n", error))

db.once('open', () => console.log("Connected to Mongoose"))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const currUrl = await ShortUrl.findOne({ short: req.params.shortUrl })

    if (currUrl == null) return res.sendStatus(404);

    currUrl.clicks++;
    currUrl.save()

    res.redirect(currUrl.full);
})

app.listen(process.env.PORT || 5000);