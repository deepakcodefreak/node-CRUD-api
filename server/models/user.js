const mongoose = require('mongoose');
const {isEmail} = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt =  require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        minlength:1,
        trim:true,
        required:true,
        unique:true,
        validate:{
            validator:isEmail,
            message:`{VALUE} is not a valid email`
        }
    },
    password:{
        type:String,
        minlength:6,
        trim:true,
        required:true
    },
    tokens:[
        {
            access:{
                type:String,
                required:true
            },
            token:{
                type:String,
                required:true
            }
        }
    ]
})

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = _.pick(user,['_id','email'])

    return userObject;
}

UserSchema.methods.generateUserToken = function(){
    var user = this;
    var access = 'auth';
    var data = { _id:user._id.toHexString(),access};
    var token = jwt.sign(JSON.stringify(data),'mysecret');

    user.tokens.push({access,token});

    return user.save().then(()=>{
      return token;  
    })

}

UserSchema.methods.removeToken = function(token){
    var user = this;

   return user.update({
        $pull:{
            tokens:{
                token:token
            }
        }
    })
}

UserSchema.statics.findByToken = function(token){
    var user = this;
    var decoded;

    try{
        decoded = jwt.verify(token,'mysecret')        
    }catch(e){
        return new Promise((resolve,reject)=>{
            reject();
        })
    }

    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    })
}

UserSchema.statics.findByCredentials = function(email,password){
    var User = this;
    
   return  User.findOne({email}).then((user)=>{
        if(!user){
            return new Promise.reject()
        }

        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res){
                    return resolve(user);
                }

                reject();
            })
        })
    })
}

UserSchema.pre('save',function(next){
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(user.password,salt,function(err,hash){
                user.password = hash;
                next();
            })
        })
    }else{
        next();
    }
})


var User = mongoose.model('Users',UserSchema)



module.exports = {
    User
}