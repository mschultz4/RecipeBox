/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {"use strict";

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _pgPromise = __webpack_require__(2);

	var _pgPromise2 = _interopRequireDefault(_pgPromise);

	var _assert = __webpack_require__(3);

	var _assert2 = _interopRequireDefault(_assert);

	var _bcryptjs = __webpack_require__(4);

	var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

	var _bodyParser = __webpack_require__(5);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _path = __webpack_require__(6);

	var _path2 = _interopRequireDefault(_path);

	var _queries = __webpack_require__(7);

	var _queries2 = _interopRequireDefault(_queries);

	var _expressSession = __webpack_require__(8);

	var _expressSession2 = _interopRequireDefault(_expressSession);

	var _auth = __webpack_require__(9);

	var _auth2 = _interopRequireDefault(_auth);

	var _passport = __webpack_require__(10);

	var _passport2 = _interopRequireDefault(_passport);

	var _passportGoogleOauth = __webpack_require__(11);

	var _connectFlash = __webpack_require__(12);

	var _connectFlash2 = _interopRequireDefault(_connectFlash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Authorization
	var app = (0, _express2.default)();
	var saltRounds = 10;
	var port = 8080;
	var cn = {
	  host: "localhost",
	  port: 5432,
	  database: "recipebox",
	  pools: 10,
	  user: "mschultz"
	};
	var db = (0, _pgPromise2.default)()(process.env.DATABASE_URL || cn);

	// Middleware
	app.use(_bodyParser2.default.json());
	app.use(_bodyParser2.default.urlencoded({ extended: true }));
	app.use(_express2.default.static(_path2.default.join(__dirname, "dist")));

	// Passport Authorization
	app.use((0, _expressSession2.default)({ secret: "strawberry fields forever", resave: false, saveUninitialized: false }));
	app.use(_passport2.default.initialize());
	app.use(_passport2.default.session());
	app.use((0, _connectFlash2.default)());

	_passport2.default.use(new _passportGoogleOauth.OAuth2Strategy({
	  clientID: _auth2.default.googleAuth.clientID,
	  clientSecret: _auth2.default.googleAuth.clientSecret,
	  callbackURL: _auth2.default.googleAuth.callbackURL
	}, function (token, refreshToken, profile, done) {
	  return done(null, profile);
	}));
	_passport2.default.serializeUser(function (user, done) {
	  return done(null, user.id);
	});
	_passport2.default.deserializeUser(function (id, done) {
	  done(null, { id: id, name: "hardcoded user" });
	});

	// Routes
	app.get("/", function (req, res) {
	  res.render("./dist/index.html");
	});
	app.get("/auth/google", _passport2.default.authenticate("google", { scope: ["email", "profile"] }));
	app.get("/auth/google/callback", _passport2.default.authenticate("google", { failureRedirect: "/", failureFlash: true }), function (req, res) {
	  // Successful authentication, redirect home.
	  console.log("success");
	  res.redirect("/");
	});
	app.post("/api/saverecipe", function (req, res) {
	  db.tx(function (t) {
	    return t.one(_queries2.default.insertRecipe, req.body).then(function (data) {
	      var ingredientsQueries = req.body.ingredients.map(function (ing) {
	        return t.none(_queries2.default.insertIngredient, Object.assign({}, { recipeid: data.recipeid }, ing));
	      });
	      var instructionsQueries = req.body.instructions.map(function (ins) {
	        return t.none(_queries2.default.insertInstruction, Object.assign({}, { recipeid: data.recipeid }, ins));
	      });

	      return t.batch([].concat(ingredientsQueries, instructionsQueries));
	    });
	  }).then(function (events) {
	    console.log(events);
	  }).catch(function (error) {
	    console.log(error);
	    // error
	  });

	  return res.json(req.body);
	});

	app.post("/recipes/deleterecipe", function (req, res) {
	  db.none(_queries2.default.deleteRecipe, [req.body.recipeId]).then(function (events) {
	    return console.log(events);
	  }).catch(function (error) {
	    return console.log(error);
	  });

	  return res.json(req.body);
	});

	app.get("/api/recipes/", function (req, res) {
	  db.one(_queries2.default.selectRecipes).then(function (data) {
	    return res.json(data);
	  }).catch(function (error) {
	    return console.log(error);
	  });
	});

	app.listen(port, function () {
	  console.log("Example app listening on port " + port + "!");
	});

	// route middleware to make sure a user is logged in
	function isAuthenticated(req, res, next) {

	  // if user is authenticated in the session, carry on
	  if (req.isAuthenticated()) return next();

	  // if they aren't redirect them to the home page
	  res.redirect('/');
	}
	/* WEBPACK VAR INJECTION */}.call(exports, ""))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = require("pg-promise");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = require("assert");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = require("bcryptjs");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = require("body-parser");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = require("path");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";

	var insertRecipe = "INSERT INTO recipes (title, notes, favorite) \n    VALUES ($[title], $[notes], $[favorite]) \n    RETURNING recipeid";

	var insertIngredient = "INSERT INTO ingredients (recipeid, ingredient, sequence) \n    VALUES ($[recipeid], $[ingredient], $[sequence])";

	var insertInstruction = "INSERT INTO instructions (recipeid, instruction, sequence) \n    VALUES ($[recipeid], $[instruction], $[sequence])";

	var deleteRecipe = "DELETE FROM recipes\n     WHERE recipeid = $1";

	var selectRecipes = "SELECT json_agg ( json_build_object \n        ( 'id', recipes.recipeid\n        , 'title', recipes.title\n        , 'notes', recipes.notes\n        , 'favorite', recipes.favorite\n        , 'ingredients', ( \n            SELECT json_agg ( json_build_object \n                ( 'ingredient', ingredients.ingredient \n                , 'sequence', ingredients.sequence\n                )\n            ) \n            FROM ingredients \n            WHERE recipes.recipeid = ingredients.recipeid\n            ) \n        , 'instructions', ( \n            SELECT json_agg ( json_build_object \n                ( 'instruction', instructions.instruction\n                , 'sequence', instructions.sequence\n                )\n            ) \n            FROM instructions \n            WHERE recipes.recipeid = instructions.recipeid\n            ) \n        )\n    ) as recipes\n    FROM recipes";

	module.exports = {
	    insertRecipe: insertRecipe,
	    insertIngredient: insertIngredient,
	    insertInstruction: insertInstruction,
	    selectRecipes: selectRecipes,
	    deleteRecipe: deleteRecipe
	};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = require("express-session");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";

	module.exports = {
	  googleAuth: {
	    clientID: "992563509206-d36ti5384mj30q5b76a2km05dld3v6ja.apps.googleusercontent.com",
	    clientSecret: "CZd6o82LZXCTaepXbwBXBk5S",
	    callbackURL: "http://localhost:8080/auth/google/callback"
	  }
	};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	module.exports = require("passport");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = require("passport-google-oauth");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = require("connect-flash");

/***/ })
/******/ ]);