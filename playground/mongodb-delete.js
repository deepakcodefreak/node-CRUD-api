const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client)=>{
    if(err){
        return console.log('Unable to connect to Database Server')
    }

    console.log('Conneced to Database Server')

    const db = client.db('TodoApp');

    db.collection('Users').deleteMany({name:'Deepak'}).then((res)=>{
        console.log(res)
    },(err)=>{
        console.log('Unable to Delete record',res)
    })

    client.close();
})