const express=require('express')
const router = express.Router()
const db=require('../models')
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

router.post('/login',(req,res)=>[
  res.send('you have been login ')
])
router.post('/logout',(req,res)=>{
  res.send('you have been log out')
})


 module.exports = router;