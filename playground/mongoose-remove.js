const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');
const {mongoose} = require('../server/db/mongoose');

Todo.findByIdAndRemove('5c890d27842aff3b93e66894').then((res)=>{
    console.log(res)
}).catch((e)=>{
    console.log(e)
})