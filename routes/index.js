const express = require("express");
const router = express.Router();

const passport = require("passport");
const LocalStrategy = require("passport-local");
const FaceBookStrategy = require('passport-facebook')
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    return User.findOne({
      attributes: ["id", "email", "account", "password"],
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "email或密碼錯誤" });
        }
        return bcrypt.compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return done(null, false, { message: "email或密碼錯誤" });
            }
            return done(null, user);
          });
      })
      .catch((error) => {
        error.errorMessage = "登入失敗";
        done(error);
      });
  })
);

passport.use(new FaceBookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id','displayName']
    },
    (accessToken, refreshToken, profile, done) => {
      const email="example@facebook.com"
      const name=profile.displayName
          return User.findOne({
            attributes: ["id", "email", "account"],
            where: { email },
            raw: true,
          })
            .then((user) => {
              if (user) {
                return done(null, user);
              }
              const randomPwd = Math.random().toString(36).slice(-8)

              return bcrypt.hash(randomPwd,10)
                    .then((hash)=>User.create({account:name , email , password:hash }))
                    .then((user)=>done(null, {id:user.id ,name:user.name,email:user.email }))
            })
            .catch((error) => {
              error.errorMessage = "登入失敗";
              done(error);
            });
    }
  )
);

passport.serializeUser((user, done) => {
  const { id, account, email } = user;
  return done(null, { id, account, email });
});

passport.deserializeUser((user, done) => {
  done(null, { id: user.id });
});

const users = require("./users");
const todos = require("./todos");
const authHandler = require("../middlewares/auth-handler");

router.use("/todos", authHandler, todos);
router.use("/users", users);


router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ['email'] }) //轉址路由
  
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
