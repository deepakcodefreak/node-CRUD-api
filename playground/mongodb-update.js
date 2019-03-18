const {MongoClient,ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client)=>{
    if(err){
        return console.log('Unable To connect to Database',err)
    }

    console.log('Connected to DataBase');

    const db = client.db('TodoApp');


    db.collection('Todos').findOneAndUpdate(
        {
            _id:new ObjectID('5c867ea9dac131bea2af0f54')
        },
    {
        $set:{
            completed:true
        }
    },
     {
        returnOriginal:false
     }
    ).then((res)=>{
        console.log(res);
    })

    client.close();
})