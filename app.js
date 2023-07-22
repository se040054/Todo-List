const express=require('express')
const app=express()

const db=require('./models')
const Todo=db.Todo
const { engine } = require('express-handlebars')
app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({extends:true}))
app.get('/',(req,res)=>{
  res.render('home')
})

app.get('/todos',(req,res)=>{
  return Todo.findAll({
    attributes: ['id', 'name'],
    raw: true 
    })
            .then((todos)=>res.render('todos',{todos}))
            .catch((err)=>{res.status(422).json(err)})
})

app.get('/todos/new',(req,res)=>{
  
  return res.render('new')
})

app.post('/todos',(req,res)=>{
  const name =req.body.name
  
  return Todo.create({name}).then(()=>{
    res.redirect('/todos')
  })
})


app.get('/todos/:id',(req,res)=>{
  res.send(`get todo : ${req.params.id}`)
})

app.get('/todos/:id/edit',(req,res)=>{
  res.send(`edit todo : ${req.params.id}`)
})

app.put('/todos/:id',(req,res)=>{
  res.send(`modify todo `)
})

app.delete('/todos/:id',(req,res)=>{
  res.send(`delete todo`)
})



app.listen(3000,()=>{
  console.log('Click : http://localhost:3000/')
})