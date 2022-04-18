var token;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy({ usernameField: "email" }, function (email, password, cb) {
    console.log(email, password, "login");
    userdata.findOne({ email: email }, async function (err, user) {
      if (err) return cb(err);
      if (!user) return cb(null, false);
      if (user.password != password) return cb(null, false);
      // console.log(user);

      token = await user.generateToken();

      // console.log(token, "token");
      return cb(null, user);
    });
  })
);
passport.serializeUser((user, done) => {
  if (user) return done(null, user.id);
  return done(null, false);
});
passport.deserializeUser((id, done) => {
  userdata.findById(id, (err, user) => {
    if (err) return done(null, false);
    return done(null, user);
  });
});
