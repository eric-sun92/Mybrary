if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()

app.set('view engine', 'ejs')
// app.set('views', __dirname + '/views')

const expressLayouts = require('express-ejs-layouts')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)

app.use(express.static('public'))
// app.use(express.urlencoded({extended : true}))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({limit: '10mb', entended: false}))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser : true})

const db = mongoose.connection
db.on('error', error => console.log("error"))
db.once('open', error => console.log("connected to mongoose"))


const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)


app.listen(process.env.PORT || 3000)