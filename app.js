const express=require('express')
const app=express()
const db=require('./models')
const Todo=db.Todo
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({extends:true}))
app.use(methodOverride('_method'))


app.get('/',(req,res)=>{
  res.redirect('/todos')
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
  const id =req.params.id
  return Todo.findByPk(id,{
    attributes:['id','name'],
    raw:true
  }).then((todo)=>res.render('todo',{todo}))
})

app.get('/todos/:id/edit',(req,res)=>{
  const id=req.params.id
  return Todo.findByPk(id,{
    attributes:['id','name'],
    raw:true
  }).then((todo)=>res.render('edit',{todo}))
  
})

app.put('/todos/:id',(req,res)=>{
  const body=req.body
  const id=req.params.id

  return Todo.update({name:body.name},{
    where : {id}
  }).then(()=>res.redirect(`/todos/${id}`))

  // return Todo.findByPk(id,{
  //   attributes:['id','name']
  // }).then((todo)=>{
  //   todo.name=body.name
  //   console.log(todo)
  //   return todo.save()
    
  // }).then((todo)=>res.redirect(`/todos/${todo.id}`))
})

app.delete('/todos/:id',(req,res)=>{
  const id=req.params.id
  return Todo.destroy({
    where:{id}
  }).then(()=>{res.redirect('/todos')})
  
})



app.listen(3000,()=>{
  console.log('Click : http://localhost:3000/')
})