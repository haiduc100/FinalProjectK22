const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.checkDuplicate = (req, res, next) => {
  console.log(200, req.body);
  User.findOne({ Username: req.body.UserName })
    .then((user) => {
      if (user) {
        res.json({
          message: "User already exists!",
          status: 400,
          err: false,
        });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.json({ message: "Error server", status: 500, err: err });
    });
};

// module.exports.checkRole =  (req, res, next) => {
//   try {
//     const role =  req.role
//     if (role == 0) {
//       next()
//     } else {
//       res.json("You must have permission admin to view this page")
//     }
//   } catch (e) {
//     res.json(e)
//   }
// }

module.exports.checkLogin = (req, res, next) => {
  const cookies = req.cookies.admin;
  try {
    if (cookies) {
      const userid = jwt.verify(cookies, process.env.ACCESS_TOKEN_SECRET).id;
      User.findOne({ _id: userid, Token: cookies })
        .then((data) => {
          if (data) {
            req.Role = data.role;
            req.userId = userid;
            next();
          } else {
            res.redirect("/user/LogInAdmin");
          }
        })
        .catch((err) => {
          res.json(err);
        });
    } else {
      res.redirect("/user/LogInAdmin");
    }
  } catch (error) {
    if (error.message === "jwt expired") {
      res.redirect("/user/LogInAdmin");
    } else {
      console.log(62, error);
    }
  }
};