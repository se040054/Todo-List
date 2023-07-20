const express=require('express')
const app=express()


app.get('/',(req,res)=>{
  res.send('hello world')
})

app.get('/todos',(req,res)=>{
  res.send('get all todos')
})

app.get('/todos/new',(req,res)=>{
  res.send('get create todo page')
})

app.post('/todos',(req,res)=>{
  res.send('add todo')
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