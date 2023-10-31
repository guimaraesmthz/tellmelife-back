const { Router } = require("express");
const thoughtRouter = Router();
const { sql } = require("../db");
const { celebrate,Joi,segments, Segments } = require("celebrate");
const cors = require("cors");
const checkAuth = require("./middleware/check-auth");

const corsOptions = {
    origin: ['http://localhost:3001','http://192.168.1.4:3001','https://tellmelife.vercel.app/*','http://localhost:3000',"https://tellmelife.vercel.app"],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true
};

thoughtRouter.options("/*",cors(corsOptions),(req,res)=>{
    res.setHeader('Cache-Control','none');
    res.status(200);
});

thoughtRouter.get("/findthought",cors(corsOptions),(req,res)=>{
    (async function(){
        await sql`SELECT *        
        FROM thoughts OFFSET floor(random() * (
		        SELECT
			        COUNT(*)
			        FROM thoughts))
        LIMIT 1;`
        .then((result)=>{
            res.setHeader('Content-Type','application/json');
            res.status(200);
            res.send(JSON.stringify({control:{code:200,message:"Thought found!"},data:{
                thought: result[0].thought
            }}));
        })
    })();
    
});

thoughtRouter.put("/prethought",cors(corsOptions),checkAuth,celebrate({
    [Segments.BODY]:Joi.object().keys({
        thought:Joi.string().required().max(400)
    })
}),(req,res)=>{
    const thought = req.body.thought;
    (async function(){
        await sql`insert into prethought (thought) values(${thought})`;
    })()
    .then(()=>{
        res.setHeader('Content-Type','application/json');
        res.status(201);
        res.send(JSON.stringify({control:{code:201,message:'Thought under internal approval!'}}))
    })
    .catch(()=>{
        res.setHeader('Content-Type','application/json');
        res.status(500);
        res.send(JSON.stringify({control:{code:500,message:"Internal Server Error. Try again later!"}}))
    });
});

module.exports = {
    thoughtRouter
}