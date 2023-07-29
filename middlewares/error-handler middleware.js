module.exports = (error , req , res ,next )=>{
  console.error(error)
	req.flash('error', error.errorMessage || '伺服器發生問題')
	res.redirect('back')

  next(error) //傳回Express預設的錯誤處理middleware
}