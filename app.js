const express = require('express')
// 创建 web 服务器
const app = express()
//解析req
const bodyParser = require('body-parser')

//登录接口 
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
const joi = require('joi')


app.get('/user/getInfo',(req,res)=>{
     res.send({
        status:200,
        message:'获取用户信息成功',
        data:req.user // app.use(expreeJwt
    })

})

// 响应数据的中间件--------------路由之前封装
app.use(function (req, res, next) {
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      // 状态
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 路由------》正规
app.use('/api', require('./router/user'))

//全局错误处理中间件---路由之后
app.use((err,req,res,next)=>{
    // if(err.name='UnauthorizedError'){
    //     return res.send({
    //         status:401,
    //         message:'无效的token'
    //     })
    // }
      // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 未知错误
   return  res.cc(err)
    // res.send({
    //     status:500,
    //     message:'未知的错误'
    // })
})


app.listen(80, () => {
  console.log('express server running at http://127.0.0.1')
})