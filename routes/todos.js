const express= require('express')
const router =express.Router()
const db=require('../models')
const Todo=db.Todo



router.get('/', async (req,res,next)=>{
    // throw new Error('error' , 'error happened') 同步錯誤
    console.log(req.user)
    const page=parseInt(req.query.page) || 1
    const limit = 10 
    const todos = await Todo.findAll({
    attributes: ['id', 'name','isDone'],
    offset:(page-1) *limit  , 
    limit ,  
    raw: true 
    }).catch((error)=>{
        error.errorMessage='取得Todo清單時發生問題'
        next(error)
      })
    const {count} = await Todo.findAndCountAll()
      .catch((error)=>{
        error.errorMessage='取得項目總數量發生問題'
        next(error)
      })
    const all = Math.ceil(count/limit)
      
    res.render(('todos'),{
      todos , 
      page , 
      prev :  page>0 ? page-1 : page , 
      next : page < all ? page +1 : page , 
      all
    })  
      
})

router.get('/new',(req,res)=>{
    // throw new Error('error' , 'error happened')
    return res.render('new')
})

router.post('/',  (req, res,next) => {
    // throw new Error('error' , 'error happened')
		const name = req.body.name
		return  Todo.create({ name })
			.then(() => {
         // throw new Error('error' , 'error happened') //注意這個error拋出的位置是在then 意思是操作仍會被執行 只是驗證錯誤訊息能否渲染
				req.flash('success', '新增成功!')
				return res.redirect('/todos')
			}).catch((error)=>{
         error.errorMessage = '新增失敗'
         next(error)
      })
})


router.get('/:id', (req,res,next)=>{
    // throw new Error('error' , 'error happened')
    const id =req.params.id
      return Todo.findByPk(id,{
        attributes:['id','name','isDone'],
        raw:true
        
      }).then((todo)=>
        {
          // throw new Error('error' , 'error happened')
          res.render('todo',{todo})
        })        
        .catch((error)=>{
         error.errorMessage = '取得此項目發生錯誤'
         next(error)
      })
})


router.get('/:id/edit',(req,res,next)=>{
    // throw new Error('error' , 'error happened')
    const id=req.params.id
      return Todo.findByPk(id,{
        attributes:['id','name','isDone'],
        raw:true
      }).then((todo)=>
      {
       // throw new Error('error' , 'error happened')
        res.render('edit',{todo})
      })
      .catch((error)=>{
         error.errorMessage = '取得項目編輯頁發生錯誤'
         next(error)
      })
})


router.put('/:id',(req,res,next)=>{
    // throw new Error('error' , 'error happened')
    const { name , isDone } =req.body
    const id=req.params.id
    return Todo.update(
        {
          name , 
          isDone : isDone ==='done'
        },{
        where : {id}
      }).then(()=>{
        // throw new Error('error' , 'error happened')
        req.flash('success', '修改成功!')
        res.redirect(`/todos/${id}`)
      }).catch((error)=>{
         error.errorMessage = '修改項目失敗'
         next(error)
      })
})

router.delete('/:id',(req,res,next)=>{
    // throw new Error('error' , 'error happened')
    const id=req.params.id
      return Todo.destroy({
        where:{id}
      }).then(()=>{
        //throw new Error('error' , 'error happened')
        req.flash('success', '刪除成功!')
        res.redirect('/todos')
      }).catch((error)=>{
         error.errorMessage = '刪除失敗'
         next(error)
      })
})

 module.exports = router