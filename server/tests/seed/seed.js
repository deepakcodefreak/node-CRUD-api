const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/todo')
const {User} = require('../../models/user')
const jwt  =require('jsonwebtoken');

var id1 = new ObjectID();
var id2 = new ObjectID();

let userOneID = new ObjectID();
let userTwoID = new ObjectID();

const users = [
    {
        _id:userOneID,
        email:'istdc@deepakcodefreak.com',
        password:'cantguessmypass',
        tokens:[
            {
                access:'auth',
                token: jwt.sign({_id:userOneID,access:'auth'},'mysecret').toString()
            }
        ]
    },
    {
        _id:userTwoID,
        email:'panny@gmail.com',
        password:'prernaPundir@rediffmail.com',
        tokens:[
            {
                access:'auth',
                token: jwt.sign({_id:userTwoID,access:'auth'},'mysecret').toString()
            }
        ]
    }
]

const todos = [
    {
        _id: id1,
        title:'hey dc',
        completed:false,
        _creator:userOneID
    },
    {
        _id: id2,
        title:'hey panny',
        completed:true,
        completedAt:1324,
        _creator:userTwoID
    }
]

const populateTodos = (done)=>{
    Todo.deleteMany({}).then(()=>{
        Todo.insertMany(todos).then(()=>done())
    })
}

const populateUsers = (done)=>{
    User.deleteMany({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne,userTwo])
    }).then(()=>done())
}



module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}