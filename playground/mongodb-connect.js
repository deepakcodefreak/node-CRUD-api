const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client)=>{
    if(err){
        return console.log('Unable to connect to DataBase')
    }

    console.log('Connected to DataBase');

     const db = client.db('TodoApp');
     
    //  db.collection('Todos').insertOne({
    //      title:'Code Some Node Js',
    //      body:'code from node js second edition course'
    //  },(err,result)=>{
    //     if(err){
    //         return console.log(err)
    //     }

    //     console.log(JSON.stringify(result.ops,undefined,2));
    //  })


    db.collection('Users').insertOne({
        name:'Deepak',
        age:19,
        email:'deepak19.engg@gmail.com'
    },(err,result)=>{
        if(err){
            return console.log(err);
        }

        // console.log(JSON.stringify(result.ops,undefined,2));
        console.log(result.ops[0]._id.getTimestamp())
    })



    client.close();
})

