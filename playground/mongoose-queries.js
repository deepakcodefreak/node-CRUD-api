const {ObjectId} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');

const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');


var id = 'c88a4d76f76c3257afb6f27';

// Todo.find({
//     _id:id
// }).then((todos)=>{
//     console.log(todos)
// })

// Todo.findOne({
//     _id:id
// }).then((todo)=>{
//     console.log(todo)
// })

// if(!ObjectId.isValid(id)){
//     return console.log('Id is not valid')
// }

// Todo.findById(id).then((todo)=>{
//     if(!todo){
//         return console.log('Id not found')
//     }
//     console.log(todo)
// }).catch((e)=>console.log(e))



User.findById('5c87bc41781f640ad2a91a7d').then((user)=>{
    if(!user){
        return console.log('User not found')
    }

    console.log(user)
}).catch((e)=>console.log(e))