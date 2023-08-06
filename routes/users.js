const express=require('express')
const router = express.Router()
const db=require('../models')
const passport = require('passport')
const User = db.User


router.get('/login',(req,res)=>{
  res.render('login')
})

router.get('/register',(req,res)=>{
  res.render('register')
})

router.post('/register',(req,res,next)=>{
  const {account , email , password , confirm_password} = req.body
  const data = { account, email, password ,confirm_password}; 
  if (!account || !email || !password || !confirm_password){
    req.flash('error','有項目未填寫')
    return res.redirect('back')
  }
  if(password != confirm_password) {
    req.flash("error", "密碼不一致");
    return res.redirect("back");    
  }
  return User.count({
    where: {account}
  }).then((user)=>{
    if (user>0){
      req.flash("error", "帳號已被使用!");
      
    }else{
    req.flash('success','創建成功')
    return  User.create({account , password , email})
    
  }
  }).then((user)=>{
    if (!user){
    return res.redirect("back");
    }
    return res.redirect('/users/login')
  }).catch((error)=>{
    error.errorMessage="創建失敗"
    next(error)
  })
})

// router.post('/login',
//   passport.authenticate('local',{ //教案方法 無法確認是否有欄位為空，有欄位空則missing credential
//     successRedirect : '/todos',
//     failureRedirect : '/users/login' ,
//     failureFlash :true
//   }))

//GPT給的
router.post('/login',(req,res,next)=>{
  const {email,password} = req.body
  if (!email || !password){
    req.flash('error','信箱或密碼沒填寫')
    return res.redirect('/users/login')
  }

  passport.authenticate("local", {
    successRedirect: "/todos",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
})
//順序是先調用router的req,res 然後轉交給passport驗證 然後轉交回router的req,res，因為前面多了一個驗證後面要再轉交回來

router.post('/logout',(req,res)=>{
  req.logout((error)=>{
    if (error){
      next(error)
    }
    return res.redirect("/users/login");
  })
  
})


 module.exports = router;