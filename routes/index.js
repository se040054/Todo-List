const express  =require('express')
const router =express.Router()

const passport = require("passport");
const LocalStrategy = require("passport-local");

const db = require("../models");
const User = db.User;

passport.use(new LocalStrategy({usernameField:'email'},(username , password ,done )=>{
  return User.findOne({
    attributes :[ 'id' , 'email' , 'account' , 'password'],
    where:{email:username},
    raw:true
  }).then((user)=>{
    if (!user || user.password !== password){
      return done(null, false , {message : 'email或密碼錯誤'})
    }
    return done(null,user)
  }).catch((error)=>{
    error.errorMessage="登入失敗"
    done(error)
  })
}))

passport.serializeUser((user,done)=>{
  const {id ,account , email ,}  =user
  return done(null  ,{id ,account  ,email })
})


const users = require("./users");
const todos = require("./todos");
router.use('/todos',todos)
router.use("/users", users);



router.get('/',(req,res)=>{
  res.redirect('/todos')
})


module.exports = router

