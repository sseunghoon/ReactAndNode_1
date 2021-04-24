const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const { User } = require("./models/User")

const config = require('./config/key')

//application/x-www-form-urlencoded << 이렇게 생긴 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended: true}))

//application/json << 이렇게 생긴 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
	useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=>console.log('MongoDB Connected...'))
	.catch(err => console.log(err))

app.get('/',(req,res)=>res.send('Hello World!123수정내용')) // router 생성

// endPoint가 /register, callBack funtion이 request, response
app.post('/register', (req, res) => { 
	
	//회원 가입 할때 필요한 정보들을 client에서 가져오면
	//그것들을 데이터 베이스에 넣어준다.
	
	const user = new User(req.body)
	
	//mongoDB에서온 method
	//user 모델에 저장
	user.save((err, userInfo)=>{
		if(err){
			return res.json({success:false, err})
		}
		return res.status(200).json({
			success:true
		})
	})
	
	
	
	
}) 

app.listen(port, () => console.log(`Example app listening on port ${port}`))
