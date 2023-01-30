const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
    findUserByObjectOfParameters,
    updateUserByIdService,
  } = require("../../services/users");

const loginUserController = async (req, res) => {
    const { email: requestEmail, password: requestPassword } = req.body;
  
    try {
      const user = await findUserByObjectOfParameters({ email: requestEmail });
  
      if (!user) {
        throw new Error(`No user was found with Email: ${requestEmail}`);
      }
  
      const {
        _id,
        email: userEmail,
        password: userPassword,
        subscription,
        verify,
      } = user;
  
      if (!verify) {
        throw new Error("User must be verified");
      }
  
      const isUsersPasswordMatch = await bcrypt.compare(
        requestPassword,
        userPassword
      );
  
      if (!isUsersPasswordMatch) {
        throw new Error("Wrong password");
      }
  
      const token = jwt.sign({ _id }, process.env.JWT_SECRET, {expiresIn: "2h"});
  
      await updateUserByIdService(_id, { token });
  
    
      const result = {
        token,
        user: {
          email: userEmail,
          subscription: subscription,
        },
      };
  
      res.json({ code: "login-success", result });
    } catch (error) {
      return res
        .status(401)
        .json({ code: "login-error", message: error.message });
    }
  };

  module.exports = loginUserController;