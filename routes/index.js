const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("./users");
const todos = require("./todos");
const authHandler = require("../middlewares/auth-handler");
router.use("/todos", authHandler, todos);
router.use("/users", users);
router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] }) //轉址路由
);
router.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/todos",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);
router.get("/", (req, res) => {
  res.redirect("/todos");
});
module.exports = router;
