const express  =require('express')
const router =express.Router()

const todos = require('./todos')
router.use('/todos',todos)

const users=require('./users')
router.use("/users", users);
router.get('/',(req,res)=>{
  res.redirect('/todos')
})


module.exports = router

