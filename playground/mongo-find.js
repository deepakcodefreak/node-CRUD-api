const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client)=>{
    if(err){
        return console.log('Unable To connect to Database Server');
    }

    const db = client.db('TodoApp');


    db.collection('Todos').find().toArray().then((res)=>{
        console.log(JSON.stringify(res,undefined,2));
    },(err)=>{
        console.log(err);
    })

    console.log('Connected To Database Server');

    client.close();
})