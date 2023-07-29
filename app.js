const express=require('express')
const app=express()
const db=require('./models')
const Todo=db.Todo
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const router=require('./routes')





app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({extends:true}))
app.use(methodOverride('_method'))
app.use(session({
	secret: 'ThisIsSecret',
	resave: false,
	saveUninitialized: false
}))
app.use(flash())
app.use(router)




app.listen(3000,()=>{
  console.log('Click : http://localhost:3000/')
})