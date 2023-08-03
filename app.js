const express=require('express')
const app=express()

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require("passport");

if (process.env.NODE_ENV === 'development') {
	require('dotenv').config()
}

// console.log(process.env.SESSION_SECRET)

const router=require('./routes')
const messageHandler = require('./middlewares/message-handler')
const errorHandlerMiddleware = require('./middlewares/error-handler middleware')

app.engine('.hbs', engine({extname: '.hbs'}))

app.set('view engine', '.hbs')
app.set('views', './views')



app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));

app.use(flash())

app.use(passport.initialize())

app.use(messageHandler)

app.use(router)

app.use(errorHandlerMiddleware)



app.listen(3000,()=>{
  console.log('Click : http://localhost:3000/')
})