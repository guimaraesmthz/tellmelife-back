const { Router } = require("express");
const { usersRouter } = require("./user.js")

const apiRouter = Router();

apiRouter.use('/users',usersRouter);

module.exports = {
    apiRouter
}