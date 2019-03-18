const request = require('supertest');
const {ObjectID} = require('mongodb')
const {app} = require('../server');
const {Todo} = require('../models/todo')
const {User} = require('../models/user')
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',()=>{

    it('should save a todo',(done)=>{
        const title = 'hiii';
        request(app)
        .post('/todos')
        .set('x-auth',users[0].tokens[0].token)
        .send({title})
        .expect(200)
        .expect((res)=>{
            expect(res.body.title).toBe(title)
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.find({title}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].title).toBe(title);
                done();
            })
            .catch((e)=>done(e))
        })
    })

    it('Should not save todo if data send is invalid',(done)=>{
        request(app)
        .post('/todos')
        .set('x-auth',users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err)
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2)
                done();
            })
            .catch(()=>done())
        })
    })

})


describe('GET /todos',()=>{
    
    it('should get all the todos',(done)=>{
        request(app)
        .get('/todos')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{

            expect(res.body.todos.length).toBe(1)
        })
        .end(done);
    })

})


describe('GET /todos/:id',()=>{

    it('should get the specfic todo',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)   
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.title).toBe(todos[0].title)
        })
        .end(done)
    })

    it('should return 404 if todo not found',(done)=>{
        request(app)
        .get(`/todos/5c88a4d76f76c3257afb6f24`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    })

    it('should return 404 if not Object id',(done)=>{
        request(app)
        .get(`/todos/1234543`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('should not return todo created by some other user',(done)=>{
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)   
        .expect(404)
        .end(done)
    })


})


describe('DELETE /todos/:id',()=>{

    it('should delete any paticular todo',(done)=>{
        request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.title).toBe(todos[0].title)
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.findById(todos[0]._id.toHexString()).then((todo)=>{
                expect(todo).not.toBeTruthy();
                done();
            }).catch((e)=>done(e))
        })
    })

    it('should not delete any paticular todo own by some other user',(done)=>{
        request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
         .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.findById(todos[0]._id.toHexString()).then((todo)=>{
                expect(todo).toBeTruthy();
                done();
            }).catch((e)=>done(e))
        })
    })

    it('should not delete todo if non object id is passed',(done)=>{
        request(app)
        .delete(`/todos/1234acd`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('should not delete todo if todo not found',(done)=>{
        request(app)
        .delete(`/todos/5c89185c2e2c7a4226dabe78`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

})

describe('PATCH /todos/id',()=>{

    it('should update a todo',(done)=>{
        request(app)
        .patch(`/todos/${todos[0]._id}`)
        .set('x-auth',users[0].tokens[0].token)
        .send({title:'updated title',completed:true})
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.title).toBe('updated title')
        })
        .end((err,res)=>{
            if(err){
                return done(err)
            }

            Todo.findById(todos[0]._id).then((todo)=>{
                expect(todo.title).toBe('updated title')
                expect(todo.completed).toBe(true)
                expect(typeof todo.completedAt).toBe('number')
                done();
            }).catch((e)=>done(e))
        })
    })

    it('should not  update a todo own by some other user',(done)=>{
        request(app)
        .patch(`/todos/${todos[0]._id}`)
        .set('x-auth',users[1].tokens[0].token)
        .send({title:'updated title',completed:true})
        .expect(404)
        .end(done)
    })

    it('should clear completdAt when completed is false',(done)=>{
        request(app)
        .patch(`/todos/${todos[0]._id}`)
        .set('x-auth',users[0].tokens[0].token)
        .send({completed:false})
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.completed).toBe(false)
            expect(typeof res.body.todo.completedAt).not.toBe('number')
        })
        .end((err,res)=>{
            if(err){
                return done(err)
            }

            Todo.findById(todos[0]._id).then((todo)=>{
                expect(todo.completed).toBe(false)
                expect(todo.completedAt).not.toEqual(expect.anything())
                done()
            }).catch((e)=>done(e))
        })
    })

})


describe('GET /users/me',()=>{

    it('should return user if authenticate',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.body.email).toBe(users[0].email)
        })
        .end(done)  
    })

    it('should return 401 if not  authenticate',(done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({})
        })
        .end(done)
    })

})

describe('POST /users',()=>{

    it('should should create a user',(done)=>{
        let email = 'deepak19.engg@gmail.com';
        let password = 'dc@dcpc.com'

        request(app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toEqual(expect.anything())
            expect(res.body.email).toBe(email)
            expect(res.headers['x-auth']).toEqual(expect.anything())
        })
        .end((err)=>{
            if(err){
                return done(err)
            }

            User.findOne({email}).then((user)=>{
                expect(user).toEqual(expect.anything())
                expect(user.password).not.toBe(password)
                done();
            })
        })

    })

    it('should return validation errors if data provided is invalid',(done)=>{
        request(app)
        .post('/users')
        .send({email:'dcdeepak',password:'pass'})
        .expect(400)
        .end(done)
    })

    it('should not create a user if email is already in user',(done)=>{
        request(app)
        .post('/users')
        .send({email:'istdc@deepakcodefreak.com',password:'mypassword'})
        .expect(400)
        .end(done)
    })

})



describe('POST /users/login',()=>{

    it('Should return auth token if user with given credentials exists',(done)=>{
        request(app)
        .post('/users/login')
        .send({
            email:users[1].email,
            password:users[1].password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.email).toBe(users[1].email)
            expect(res.headers['x-auth']).toEqual(expect.anything())
        })
        .end((err,res)=>{
            if(err){
                return done(err)
            }

            User.findById(users[1]._id).then((user)=>{
                expect(user.tokens[1]).toEqual(expect.objectContaining({
                    access:'auth',
                    token:res.headers['x-auth']
                }))
                done();
            }).catch((e)=>done(e))
        })
    })

    it('should reject invalid login',(done)=>{
        request(app)
        .post('/users/login')
        .send({email:users[1].email,password:'anythingwrong'})
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).not.toEqual(expect.anything)
        })
        .end((err,res)=>{
            if(err){
                return done(err)
            }

           User.findById(users[1]._id).then((user)=>{
               expect(user.tokens.length).toBe(1)
           }) 
           done()
        })
    })

})

describe('DELETE /users/me/token',()=>{

    it('should delete auth token on log out',(done)=>{
        request(app)
        .delete('/users/me/token')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .end((err,res)=>{
            if(err){
                return done(err)
            }

            User.findById(users[0]._id).then((user)=>{
                expect(user.tokens.length).toBe(0)
                done()
            }).catch((e)=>done(e))
            
        })
    })

})