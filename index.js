const express = require('express');
const app = express();
const bodyparser= require("body-parser");
const port = process.env.port || 3000;
const { sql } = require("./db");
const { errors } = require("celebrate");
const { apiRouter } = require('./api');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

(async function(){
    const result = await sql`select version()`;
    console.log('Database connected!');
})();

app.use('/api',apiRouter);
app.use(cors());
app.use(errors());

app.listen(port,()=>{
    console.log(`Server running on ${port} port!`);
});