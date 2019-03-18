const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// var password = 'deepak@123'

// // bcrypt.genSalt(10,(err,salt)=>{
// //     bcrypt.hash(password,salt,(err,hash)=>{
// //         console.log(hash)
// //     })
// // })

// var hashedValue = '$2a$10$Y491MI2qjdrCDOIR51AP4e1dTeh2aqyZ12DosEWMR8fkjY/R5xzXu';

// bcrypt.compare(password,hashedValue,(err,res)=>{
//     console.log(res)
// })

bcrypt.compare('pannypundir','$2a$10$2afavB7KtIGNBVdSYAPzr.52Mt1FNrrT8w5wHEAXUKEYupH1vfwgG',(err,res)=>{
    console.log(res)
})
