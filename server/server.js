require('./config/config');

const {authenticate} = require('../server/middleware/authenticate');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo')
const {User} = require('./models/user')
const {ObjectId} = require('mongodb');
const _ = require('lodash')
const bcrypt  = require('bcryptjs');


const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json())

app.post('/todos',authenticate,(req,res)=>{
    let newtodo = new Todo({
        title:req.body.title,
        _creator:req.user._id
    })
    
    newtodo.save().then((docs)=>{
        res.send(docs)
    },(e)=>{
        res.status(400).send(e);
    })
})


app.get('/todos',authenticate,(req,res)=>{
    Todo.find({_creator:req.user._id}).then((todos)=>{
        res.status(200).send({todos})
    },(e)=>{
        res.status(400);
    })
})

app.get('/todos/:id',authenticate,(req,res)=>{
    let id = req.params.id;

    if(!ObjectId.isValid(id)){
        return res.status(404).send({})
    }
  
    Todo.findOne({
        _id:id,
        _creator:req.user._id
    }).then((todo)=>{
        if(!todo){
           return res.status(404).send({})
        }

        res.send({todo})
    },(e)=>{
        res.status(400).send({})
    })

})


app.delete('/todos/:id',authenticate,(req,res)=>{
    let id = req.params.id;

    if(!ObjectId.isValid(id)){
        return res.status(404).send()
    }

    Todo.findOneAndDelete({
        _id:id,
        _creator:req.user._id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send()
        }

        res.status(200).send({todo})
    }).catch((e)=>{
        res.status(400).send()
    })
})


app.patch('/todos/:id',authenticate,(req,res)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['title','completed']);

    if(!ObjectId.isValid(id)){
        return res.status(404).send()
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completedAt = null;
        body.completd = false
    }

    Todo.findOneAndUpdate({
        _id:id,
        _creator:req.user._id
    },{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send()
        }
        // console.log(todo)
        res.send({todo})
      
    }).catch((e)=>res.send(e));
})


    app.post('/users',(req,res)=>{
    
        let user = new User(_.pick(req.body,['email','password']));

    user.save().then((user)=>{
        return user.generateUserToken();
        //res.send(user)
    }).then((token)=>{
        res.header('x-auth',token).send(user)
    }).catch((e)=>{
        res.status(400).send(e)
    })

    })


app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user)
})


app.post('/users/login',(req,res)=>{
    const body = _.pick(req.body,['email','password'])

    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateUserToken().then((token)=>{
            res.header('x-auth',token).send(user)
        })
    }).catch(()=>{
        res.status(400).send()
    })
})

app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send()
    },(e)=>{
        res.status(400).send()
    })
})


app.listen(3000,()=>{
    console.log('App is Live on PORT 3000')
})


module.exports = {
    app
}