const express = require('express');
const app = express();
const bodyparser= require("body-parser");
const port = process.env.port || 3000;
const { sql } = require("./db");
const { errors } = require("celebrate");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

(async function(){
    const result = await sql`select version()`;
    console.log('Database connected!');
})();

const { apiRouter } = require('./api');

app.use('/api',apiRouter);
app.use(errors());

app.listen(port,()=>{
    console.log(`Server running on ${port} port!`);
});