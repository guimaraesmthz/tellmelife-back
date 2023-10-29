const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,process.env.JWT_KEY)
    .then(()=>{
        next();
    })
    .catch(()=>{
        return res.status(403).json({control:{code:403,message:"Forbbiden."}})
    });

};