//If we are in development mode we want to require .env
//then call .config() which will load in all of our different 
//environment variables and set them inside of process.env
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const bcrypt = require('bcrypt')
const passport = require('passport')
const users = require('./models/users')

//ROUTES
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const initializePassport = require('./config/passport')(passport)
// initializePassport(
//     passport, 
//     username => users.find(user => user.username === username),
//     id => users.find(user => user.id === id)
// )

//MongoDB atlas connection
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true 
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Database'))

const app = express()

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
    console.log("Server is running")
})

app.use('/', indexRouter)
app.use('/user', userRouter)