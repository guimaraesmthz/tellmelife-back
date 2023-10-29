const { Router } = require("express");
const { usersRouter } = require("./user.js");
const { thoughtRouter } = require("./thought.js");

const apiRouter = Router();

apiRouter.use('/users',usersRouter);
apiRouter.use('/thoughts',thoughtRouter);

module.exports = {
    apiRouter
}