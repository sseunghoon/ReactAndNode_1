const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
//salt를 10글자로 설정함
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
	name:{
		type:String,
		maxlength:50
	},
	email:{
		type:String,
		trim:true, //입력 문자에서 공백을 없애주는 것 ex)나는 송승훈 => 나는송승훈
		unique:1
	},
	password:{
		type:String,
		minlength:5
	},
	lastname:{
		type:String,
		maxlength:50
	},
	role:{
		type:Number,
		default:0
		//0이면 일반 유저 1이면 관리자 이런 방식을 활용
	},
	image:String,//{}사용해서 오브젝트로 만들지 않고 그냥 String으로 만들어도 됨
	token:{
		type:String
		//유효성 검사
	},
	tokenExp:{
		type:Number
		//유효성의 유효기간
	}
})

//index.js 의 /register router에서 save가 실행되기 전에 실행
userSchema.pre('save',function(next){
	var user = this
	
	//클라이언트가 이메일을 수정할 때도 비밀번호가 암호화가 되면 안되니
	//비밀번호를 수정할 때만 비밀번호가 암호화 되도록 설정
	
	if(user.isModified('password')){
		//비밀번호를 암호화 시킨다.
		bcrypt.genSalt(saltRounds,function(err,salt){
			if(err) return next(err)
		
			bcrypt.hash(user.password,salt,function(err,hash){
				if(err) return next(err)
			
				user.password = hash
				next()
			})
		})	
	} else{
		next()
	}
})

userSchema.methods.comparePassword=function(plainPassword,cb){
	bcrypt.compare(plainPassword, this.password, function(err,isMatch){
		if(err) return cb(err)
		
		cb(null,isMatch)
	})	
}

userSchema.methods.generateToken=function(cb){
	var user=this
	
	//secretToken은 아무의미 없음
	var token = jwt.sign(user._id.toHexString(),'secretToken')
	
	user.token=token
	user.save(function(err,user){
		if(err) return cb(err)
		cb(null,user)
	})
}

userSchema.statics.findByToken = function(token, cb){
	var user = this
	
	//token decode
	jwt.verify(token,'secretToken',function(err,decoded){
		//유저 아이디를 이용해서 유저를 찾고
		//클라에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
		
		user.findOne({"_id":decoded, "token": token}, function(err,user){
			if(err) return cb(err)
			cb(null, user) 
		})
	})
}


const User = mongoose.model('User',userSchema)

module.exports ={User}
//다른 파일에서도 쓸 수 있게 exports






