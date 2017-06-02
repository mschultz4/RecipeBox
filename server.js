import express from "express";
import pgp from "pg-promise";
import assert from "assert";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import path from "path";
import queries from "./server/queries.js";
import session from "express-session";

// Authorization
import configAuth from "./config/auth.js";
import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import flash from "connect-flash";

const app = express();
const saltRounds = 10;
const port = 8080;
const cn = {
  host: "localhost",
  port: 5432,
  database: "recipebox",
  pools: 10,
  user: "mschultz"
};
const db = pgp()(process.env.DATABASE_URL || cn);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "dist")));

// Passport Authorization
app.use(session({ secret: "strawberry fields forever", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(
  new GoogleStrategy(
    {
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL
    },
    (token, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  done(null, { id: id, name: "hardcoded user" });
});

// Routes
app.get("/", (req, res) => {
  res.render("./dist/index.html");
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", failureFlash: true }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("success");
    res.redirect("/");
  }
);
app.post("/api/saverecipe", (req, res) => {
  db
    .tx(t =>
      t.one(queries.insertRecipe, req.body).then(data => {
        const ingredientsQueries = req.body.ingredients.map(ing =>
          t.none(
            queries.insertIngredient,
            Object.assign({}, { recipeid: data.recipeid }, ing)
          )
        );
        const instructionsQueries = req.body.instructions.map(ins =>
          t.none(
            queries.insertInstruction,
            Object.assign({}, { recipeid: data.recipeid }, ins)
          )
        );

        return t.batch([].concat(ingredientsQueries, instructionsQueries));
      })
    )
    .then(events => {
      console.log(events);
    })
    .catch(error => {
      console.log(error);
      // error
    });

  return res.json(req.body);
});

app.post("/recipes/deleterecipe", (req, res) => {
  db
    .none(queries.deleteRecipe, [req.body.recipeId])
    .then(events => console.log(events))
    .catch(error => console.log(error));

  return res.json(req.body);
});

app.get("/api/recipes/", (req, res) => {
  db
    .one(queries.selectRecipes)
    .then(data => res.json(data))
    .catch(error => console.log(error));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

// route middleware to make sure a user is logged in
function isAuthenticated(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/api/login');
}