require("dotenv").config();
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const validation = schema => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        error.status = 400;
        next(error);
        return;
      }
      next();
    };
  };


  const authMiddleware = async(req, res, next) => {
    const {authorization = " "} = req.headers;
    const [bearer, token] = authorization.split(" "); 
    try {
      if(bearer !== "Bearer") {
        throw createError(401, "Not authorized")
      }
      const {id} = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(id);
      if(!user || user.token !== token){
        throw createError(401, "Not authorized")
      }
      req.user = user;
      next()
    } catch (error) {
      if(error.message === "Invalid signature"){
        error.status = 401;
      }
      next(error)
    }  
  }
  

  module.exports = {
    validation,
    authMiddleware,
  }