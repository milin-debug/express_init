// 用户的注册、登录
const express = require('express')
const app = express()

//配合secret 秘钥加密
const jwt =require('jsonwebtoken')
//配合secret 秘钥解密
const expreeJwt= require('express-jwt')
//secret 秘钥 字符串随意写
const secretKey='lyh alone'
//导入db 
const db = require('../db')


//req.user会直接挂在秘钥
app.use(expreeJwt({secret:secretKey,algorithms: ["HS256"]}).unless({path:[/^\/api\//]}))
//加密密码 
const bcrypt = require('bcryptjs')
module.exports={
    //注册
 regUser:(req, res) => {
     // 接收表单数据
const userinfo = req.body
// 判断数据是否合法

userinfo.password = bcrypt.hashSync(userinfo.password, 10)
      const sql1 = `select * from ev_users where username=?`
      const sql2 = 'insert into ev_users set ?'
    db.query(sql1,[userinfo.username], function (err, results) {
  // 执行 SQL 语句失败
  if (err) {
    return res.cc(err)
  }
  // 用户名被占用
  if (results.length > 0) {
    return res.cc('用户名被占用，请更换其他用户名！')
  }
  // TODO: 用户名可用，继续后续流程...
    })
    db.query(sql2, { username: userinfo.username, password: userinfo.password }, function (err, results) {
  // 执行 SQL 语句失败
  if (err)   return res.cc(err)
  // SQL 语句执行成功，但影响行数不为 1
  if (results.affectedRows !== 1) {
    return res.cc('注册用户失败，请稍后再试！')
  }
  // 注册成功
    return res.cc( '注册成功！',0)
})
      },
   //登录
 login :(req,res)=>{
    const userInfo=req.body
    console.log(55555,req.body);
    if(userInfo.userName !=='admin'|| userInfo.password !==123456){
        return res.send({
            status:400,
            message:'登陆失败'
        })
    }
    // 1.用户的信息对象  2.加密的秘钥 3.配置对象 当前token有效期
       //不要加密密码
     const token=  jwt.sign({ userName:userInfo.userName }, secretKey,{ expiresIn:'60s'})
       res.send({
        status:200,
        message:'登陆成功',
        token,
    })

}
}