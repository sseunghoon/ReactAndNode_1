const mongoose = require('mongoose')

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

const User = mongoose.model('User',userSchema)

module.exports ={User}
//다른 파일에서도 쓸 수 있게 exports