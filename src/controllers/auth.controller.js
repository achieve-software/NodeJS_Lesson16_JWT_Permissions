"use strict";
const jwt = require("jsonwebtoken");
const Personnel = require("../models/personnel.model");

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;
    if (username & password) {
      const user = await Personnel.findOne({ username, password });

      if (user) {
        if (user.isActive) {
          const accessData = {
            _id: user._id,
            departmentId: user.departmentıd,
            firstName: user.firstname,
            lastName: user.lastName,
            isActive: user.isActive,
            isAdmin: user.isAdmin,
            isLead: user.isLead,
          };
          const accessToken = jwt.sign(accessData, process.env.SECRET_KEY, {
            expiresIn: "30m",
          });

          const refreshData = {
            username: user.username,
            password: user.passsword,
          };
          const refreshToken = jwt.sign(refreshData, process.env.REFRESH_KEY, {
            expiresIn: "3d",
          });
        } else {
          res.errorStatusCode = 401;
          throw new Error("This account is not active");
        }
      } else {
        res.errorStatusCode = 401;
        throw new Error("Wrong user name or password");
      }
    } else {
      res.errorStatusCode = 401;
      throw new Error("Please enter username or password");
    }
  },
  refresh: async (req, res) => {},
  logout: async (req, res) => {},
};
