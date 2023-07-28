const express=require('express')
const app=express()
const db=require('./models')
const Todo=db.Todo
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

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


app.get('/',(req,res)=>{
  res.redirect('/todos')
})

app.get('/todos',(req,res)=>{
  return Todo.findAll({
    attributes: ['id', 'name','isDone'],
    raw: true 
    })
            .then((todos)=>{
              res.render('todos',{todos , message : req.flash('success')[0] || req.flash('deleted')[0] })
            }
              )
            .catch((err)=>{res.status(422).json(err)})
})

app.get('/todos/new',(req,res)=>{
  
  return res.render('new')
})

app.post('/todos',(req,res)=>{
  const name =req.body.name
  
  return Todo.create({name}).then(()=>{
    req.flash('success','新增成功')
    res.redirect('/todos')
  })
})


app.get('/todos/:id',(req,res)=>{
  const id =req.params.id
  return Todo.findByPk(id,{
    attributes:['id','name','isDone'],
    raw:true
  }).then((todo)=>res.render('todo',{todo,message:req.flash('edited')}))
})

app.get('/todos/:id/edit',(req,res)=>{
  const id=req.params.id
  return Todo.findByPk(id,{
    attributes:['id','name','isDone'],
    raw:true
  }).then((todo)=>res.render('edit',{todo}))
  
})

app.put('/todos/:id',(req,res)=>{
  const { name , isDone } =req.body
  const id=req.params.id

  return Todo.update(
    {
      name , 
      isDone : isDone ==='done'
    },{
    where : {id}
  }).then(()=>{
    req.flash('edited','編輯成功')
    res.redirect(`/todos/${id}`)
  })

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
  }).then(()=>{
    req.flash('deleted','已刪除')
    res.redirect('/todos')
  })
  
})



app.listen(3000,()=>{
  console.log('Click : http://localhost:3000/')
})