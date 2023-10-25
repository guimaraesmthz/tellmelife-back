const express = require('express');
const usersRouter = express.Router();
const { sql } = require('../db');
const {celebrate,Joi,Segments} = require('celebrate');
const bcrypt = require('bcrypt');

//User Login Route
usersRouter.post("/login",celebrate({
    [Segments.BODY]:Joi.object().keys({
        email:Joi.string().required().email(),
        password:Joi.string().required().min(7)
    })
}),(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    
    (async function(){
        const result = await sql`select password from users where email=${email}`;
        if(result.length <= 0){
            res.setHeader('Content-Type','application/json');
            res.status(400);
            res.send(JSON.stringify({control:{code:400,message:"User Not Found"}}));
        }else{
            const hashValid = await bcrypt.compare(password,result[0].password);
            if(hashValid){
                res.setHeader('Content-Type','application/json');
                res.status(200);
                res.send(JSON.stringify({control:{code:200,message:"User authorized."}}));
            }else{
                res.setHeader('Content-Type','application/json');
                res.status(403);
                res.send(JSON.stringify({control:{code:403,message:"Unauthorized!"}}));
            };
        };
        
    })();
    
});

//User Register Route
usersRouter.post("/createuser",celebrate({
    [Segments.BODY]:Joi.object().keys({
        name:Joi.string().required(),
        email:Joi.string().required().email(),
        password:Joi.string().required().min(7)
    })
}),(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    let password = req.body.password;

    (async function(){
        await bcrypt.hash(password,10).then((pass)=>{password = pass;});
        await sql`insert into users (name,email,password) values (${name},${email},${password})`;
    })().then(()=>{
        res.setHeader('Content-Type','application/json');
        res.status(201);
        res.send(JSON.stringify({control:{code:201,message:"User created."}}));
    }).catch((err)=>{
        console.log(err);
        res.setHeader('Content-Type','application/json');
        res.status(500);
        res.send(JSON.stringify({control:{code:500,message:"Internal Server Error. Try again later!"}}))
    });

});

module.exports = {
    usersRouter
};