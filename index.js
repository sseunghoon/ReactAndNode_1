const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { User } = require("./models/User")
const { auth } = require("./middleware/auth")


const config = require('./config/key')

//application/x-www-form-urlencoded << 이렇게 생긴 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended: true}))

//application/json << 이렇게 생긴 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
	useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=>console.log('MongoDB Connected...'))
	.catch(err => console.log(err))

app.get('/',(req,res)=>res.send('Hello World!123수정내용')) // router 생성

// endPoint가 /register, callBack funtion이 request, response
app.post('/api/users/register', (req, res) => { 
	
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

app.post('/api/users/login',(req,res)=>{
	//mongoDB에서 제공하는 method
	User.findOne({ email:req.body.email},(err,user)=>{
		if(!user){
			return res.json({
				loginSuccess:false,
				message:"해당 이메일이 존재하지 않습니다. 회원가입을 먼저 진행해주세요."
			})
		}
		
		user.comparePassword(req.body.password,(err,isMatch)=>{
			
			if(!isMatch)
				return res.json({loginSuccess:false,message:"비밀번호가 일치하지 않습니다."})					
			user.generateToken((err,user)=>{
				if(err) return res.status(400).send(err)
				
				//토큰을 저장한다. 어디에? 쿠키 or 로컬 스토리지 or 세션 등
				//어디에 저장하는게 가장 안전한지는 논란이 있음
				//쿠키에 저장하려면 express에서 제공하는 cookie-parser를 설치해야함
				//x_auth라는 이름의 쿠키 저장
				res.cookie("x_auth", user.token)
				.status(200)
				.json({loginSuccess:true, userID:user._id})
				
			})
			
		})
		
	})
})

//나중에 Router라는 것을 쓸때를 생각해서 /api/xxxx/를 붙여주면 좋음
//중간에 있는 auth는 middleWare, 왼쪽(auth)이 endPoint, endPoint에서 request를 받고
//callBack function을 실행하기전에 실행하는 것

app.get('/api/users/auth', auth ,(req,res)=>{
	//여기에 도착했다는 것은 middleWare를 통과했다는 것이고 Authentication이 True라는 뜻
	res.status(200).json({
		_id:req.user_id,
		isAdmin:req.user.role === 0 ? false: true,
		isAuth:true,
		email:req.user.email,
		name:req.user.name,
		lastname:req.user.lastname,
		role:req.user.role,
		image:req.user.image
	})
})

app.get('/api/users/logout', auth ,(req,res)=>{
	User.findOneAndUpdate({_id:req.user._id},{token:""},(err,user) =>{
		if(err) return res.json({success:false,err})
		
		return res.status(200).send({
			success:true
		})
	}) 
})


app.listen(port, () => console.log(`Example app listening on port ${port}`))











