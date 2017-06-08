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

	var _dbConfig = __webpack_require__(9);

	var _dbConfig2 = _interopRequireDefault(_dbConfig);

	var _render = __webpack_require__(10);

	var _render2 = _interopRequireDefault(_render);

	var _authConfig = __webpack_require__(30);

	var _authConfig2 = _interopRequireDefault(_authConfig);

	var _passport = __webpack_require__(31);

	var _passport2 = _interopRequireDefault(_passport);

	var _passportGoogleOauth = __webpack_require__(32);

	var _connectFlash = __webpack_require__(33);

	var _connectFlash2 = _interopRequireDefault(_connectFlash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Authorization
	var app = (0, _express2.default)();
	var saltRounds = 10;
	var port = 8080;
	var db = (0, _pgPromise2.default)()(process.env.DATABASE_URL || _dbConfig2.default);

	// Middleware
	app.use("/static", _express2.default.static(_path2.default.join(__dirname, "../../dist")));
	app.use(_bodyParser2.default.json());
	app.use(_bodyParser2.default.urlencoded({ extended: true }));

	// Passport Authorization
	app.use((0, _expressSession2.default)({
	  secret: "strawberry fields forever",
	  resave: false,
	  saveUninitialized: false
	}));
	app.use(_passport2.default.initialize());
	app.use(_passport2.default.session());
	app.use((0, _connectFlash2.default)());

	_passport2.default.use(new _passportGoogleOauth.OAuth2Strategy({
	  clientID: _authConfig2.default.googleAuth.clientID,
	  clientSecret: _authConfig2.default.googleAuth.clientSecret,
	  callbackURL: _authConfig2.default.googleAuth.callbackURL
	}, function (token, refreshToken, profile, done) {
	  return done(null, profile);
	}));
	_passport2.default.serializeUser(function (user, done) {
	  done(null, { id: user.id, displayName: user.displayName });
	});
	_passport2.default.deserializeUser(function (user, done) {
	  done(null, user);
	});

	// Routes
	app.get("/auth/google", _passport2.default.authenticate("google", { scope: ["email", "profile"] }));
	app.get("/auth/google/callback", _passport2.default.authenticate("google", { failureRedirect: "/", failureFlash: true }), function (req, res) {
	  // Successful authentication, redirect home.
	  console.log(req.isAuthenticated());
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

	app.get("/api/user/", function (req, res) {
	  return res.json(req.user);
	});

	// app.get("*", (req, res) => {
	//   res.render("./dist/index.html");
	// });

	app.get("/", function (req, res) {
	  (0, _render2.default)(req.url, db, res);
	});

	// app.get("*", handleRender);

	app.listen(port, function () {
	  console.log("Example app listening on port " + port + "!");
	});

	// route middleware to make sure a user is logged in
	function isAuthenticated(req, res, next) {
	  // if user is authenticated in the session, carry on
	  if (req.isAuthenticated()) return next();

	  // if they aren't redirect them to the home page
	  res.redirect("/");
	}
	/* WEBPACK VAR INJECTION */}.call(exports, "src/server"))

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

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  host: "localhost",
	  port: 5432,
	  database: "recipebox",
	  pools: 10,
	  user: "mschultz"
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = render;

	var _react = __webpack_require__(11);

	var _react2 = _interopRequireDefault(_react);

	var _redux = __webpack_require__(12);

	var _reactRedux = __webpack_require__(13);

	var _App = __webpack_require__(14);

	var _App2 = _interopRequireDefault(_App);

	var _root = __webpack_require__(25);

	var _root2 = _interopRequireDefault(_root);

	var _reactRouterDom = __webpack_require__(15);

	var _actions = __webpack_require__(18);

	var _server = __webpack_require__(29);

	var _queries = __webpack_require__(7);

	var _queries2 = _interopRequireDefault(_queries);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var context = {}; // Universal App setup


	function renderFullPage(html, preloadedState) {
	  return "<!DOCTYPE html>\n  <html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>Recipe Box</title>\n\n    <link href='/static/styles.css' rel='stylesheet'>\n    <script src=\"https://use.fontawesome.com/2cfba22f5a.js\"></script>\n    <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js\"></script>\n    <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css\" integrity=\"sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ\"\n      crossorigin=\"anonymous\">\n    <script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js\" integrity=\"sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn\"\n      crossorigin=\"anonymous\"></script>\n    <!--<script src=\"https://unpkg.com/react@15.3.0/dist/react.js\"></script>\n    <script src=\"https://unpkg.com/react-dom@15.3.0/dist/react-dom.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.15.0/lodash.min.js\"></script>-->\n  </head>\n  <body>\n    <div id=\"root\">" + html + "</div>\n    <script>\n      // WARNING: See the following for security issues around embedding JSON in HTML:\n      // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations\n      window.__PRELOADED_STATE__ = " + JSON.stringify(preloadedState).replace(/</g, "\\u003c") + "\n    </script>\n    <script src=\"/static/bundle.js\"></script>\n  </body>\n  </html>";
	}

	function render(url, db, res) {
	  // Create a new Redux store instance
	  var store = (0, _redux.createStore)(_root2.default);

	  db.one(_queries2.default.selectRecipes).then(function (data) {
	    store.dispatch((0, _actions.receivedAll)(data.recipes));

	    // Render the component to a string
	    var html = (0, _server.renderToString)(_react2.default.createElement(
	      _reactRedux.Provider,
	      { store: store },
	      _react2.default.createElement(
	        _reactRouterDom.StaticRouter,
	        { context: context, location: url },
	        _react2.default.createElement(_App2.default, null)
	      )
	    ));

	    // Grab the initial state from our Redux store
	    var preloadedState = store.getState();
	    console.log(preloadedState);
	    // Send the rendered page back to the client
	    res.send(renderFullPage(html, preloadedState));
	  }).catch(function (error) {
	    return console.log(error);
	  });
	}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = require("react");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = require("redux");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = require("react-redux");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(11);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouterDom = __webpack_require__(15);

	var _Navbar = __webpack_require__(16);

	var _Navbar2 = _interopRequireDefault(_Navbar);

	var _AddRecipe = __webpack_require__(17);

	var _AddRecipe2 = _interopRequireDefault(_AddRecipe);

	var _Recipes = __webpack_require__(20);

	var _Recipes2 = _interopRequireDefault(_Recipes);

	var _Login = __webpack_require__(22);

	var _Login2 = _interopRequireDefault(_Login);

	var _Recipe = __webpack_require__(23);

	var _Recipe2 = _interopRequireDefault(_Recipe);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var App = function App(_ref) {
	  var match = _ref.match;

	  return _react2.default.createElement(
	    "div",
	    { className: "container" },
	    _react2.default.createElement(_Navbar2.default, null),
	    _react2.default.createElement(
	      _reactRouterDom.Switch,
	      null,
	      _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: "/", component: _Login2.default }),
	      _react2.default.createElement(_reactRouterDom.Route, { path: "/new", component: _AddRecipe2.default }),
	      _react2.default.createElement(_reactRouterDom.Route, { path: "/Recipes", component: _Recipes2.default }),
	      _react2.default.createElement(_reactRouterDom.Route, { path: "/recipes/:id", component: _Recipe2.default })
	    )
	  );
	};

	exports.default = App;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	module.exports = require("react-router-dom");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(11);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouterDom = __webpack_require__(15);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Navbar = function Navbar() {
	  return _react2.default.createElement(
	    "nav",
	    { className: "navbar navbar-toggleable-md navbar-light bg-faded" },
	    _react2.default.createElement(
	      "button",
	      {
	        type: "button",
	        className: "navbar-toggler navbar-toggler-right",
	        "data-toggle": "collapse",
	        "data-target": "#navbar-content",
	        "aria-controls": "navbar-content",
	        "aria-expanded": "false",
	        "aria-label": "Toggle navigation"
	      },
	      _react2.default.createElement("span", { className: "navbar-toggler-icon" })
	    ),
	    _react2.default.createElement(
	      "a",
	      { className: "navbar-brand", href: "#" },
	      "Test"
	    ),
	    _react2.default.createElement(
	      "div",
	      { className: "collapse navbar-collapse", id: "navbar-content" },
	      _react2.default.createElement(
	        "ul",
	        { className: "navbar-nav mr-auto" },
	        _react2.default.createElement(
	          "li",
	          { className: "nav-item active" },
	          _react2.default.createElement(
	            _reactRouterDom.Link,
	            { to: "/recipes", className: "nav-link" },
	            "Home",
	            _react2.default.createElement(
	              "span",
	              { className: "sr-only" },
	              "Current"
	            )
	          )
	        ),
	        _react2.default.createElement(
	          "li",
	          { className: "nav-item" },
	          _react2.default.createElement(
	            _reactRouterDom.Link,
	            { to: "/new", className: "nav-link" },
	            "New"
	          )
	        ),
	        _react2.default.createElement(
	          "li",
	          { className: "nav-item" },
	          _react2.default.createElement(
	            _reactRouterDom.Link,
	            { to: "/", className: "nav-link" },
	            "Login"
	          )
	        )
	      ),
	      _react2.default.createElement(
	        "form",
	        { className: "form-inline my-2 my-lg-0" },
	        _react2.default.createElement("input", {
	          type: "text",
	          className: "form-control mr-sm-2",
	          placeholder: "Search"
	        }),
	        _react2.default.createElement(
	          "button",
	          { type: "submit", className: "btn btn-outline-success my-2 my-sm-0" },
	          "Search"
	        )
	      )
	    )
	  );
	};

	exports.default = Navbar;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _reactRedux = __webpack_require__(13);

	var _react = __webpack_require__(11);

	var _react2 = _interopRequireDefault(_react);

	var _actions = __webpack_require__(18);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var AddRecipe = function (_React$Component) {
		_inherits(AddRecipe, _React$Component);

		function AddRecipe(props) {
			_classCallCheck(this, AddRecipe);

			var _this = _possibleConstructorReturn(this, (AddRecipe.__proto__ || Object.getPrototypeOf(AddRecipe)).call(this, props));

			_this.state = {
				title: '',
				ingredientInput: '',
				ingredients: [],
				instructionInput: '',
				instructions: [],
				notes: '',
				favorite: false
			};

			_this._onSubmit = _this._onSubmit.bind(_this);
			_this._onTitleInput = _this._onTitleInput.bind(_this);
			_this._onIngredientInput = _this._onIngredientInput.bind(_this);
			_this._onIngredientAdd = _this._onIngredientAdd.bind(_this);
			_this._onInstructionInput = _this._onInstructionInput.bind(_this);
			_this._onInstructionAdd = _this._onInstructionAdd.bind(_this);
			_this._toggleFavorite = _this._toggleFavorite.bind(_this);
			_this._onNotesInput = _this._onNotesInput.bind(_this);
			return _this;
		}

		_createClass(AddRecipe, [{
			key: 'render',
			value: function render() {
				return _react2.default.createElement(
					'form',
					{ onSubmit: this._onSubmit, className: 'form' },
					_react2.default.createElement(
						'div',
						{ className: 'form-group' },
						_react2.default.createElement(
							'label',
							{ htmlFor: 'recipe-title' },
							'Title'
						),
						_react2.default.createElement('input', {
							type: 'text',
							name: 'recipe-title',
							onChange: this._onTitleInput,
							value: this.state.title,
							className: 'form-control',
							placeholder: 'Enter a title'
						})
					),
					_react2.default.createElement(
						'div',
						{ className: 'form-group' },
						_react2.default.createElement(
							'label',
							{ htmlFor: 'ingredients' },
							'Ingredients'
						),
						_react2.default.createElement(
							'ul',
							null,
							this.state.ingredients.map(function (ing, index) {
								return _react2.default.createElement(
									'li',
									{ key: index },
									ing.ingredient
								);
							})
						),
						_react2.default.createElement(
							'div',
							{ className: 'input-group' },
							_react2.default.createElement('input', {
								type: 'text',
								name: 'ingredients',
								onChange: this._onIngredientInput,
								value: this.state.ingredientInput,
								className: 'form-control',
								placeholder: 'Enter an ingredient'
							}),
							_react2.default.createElement(
								'span',
								{ className: 'input-group-btn' },
								_react2.default.createElement(
									'button',
									{
										className: 'btn btn-secondary',
										type: 'button',
										onClick: this._onIngredientAdd
									},
									'Add'
								)
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'form-group' },
						_react2.default.createElement(
							'label',
							{ htmlFor: 'instructions' },
							'Instructions'
						),
						_react2.default.createElement(
							'ul',
							null,
							this.state.instructions.map(function (ins, index) {
								return _react2.default.createElement(
									'li',
									{ key: index },
									ins.instruction
								);
							})
						),
						_react2.default.createElement(
							'div',
							{ className: 'input-group' },
							_react2.default.createElement('input', {
								type: 'text',
								name: 'instructions',
								onChange: this._onInstructionInput,
								value: this.state.instructionInput,
								className: 'form-control',
								placeholder: 'Enter an instruction'
							}),
							_react2.default.createElement(
								'span',
								{ className: 'input-group-btn' },
								_react2.default.createElement(
									'button',
									{
										className: 'btn btn-secondary',
										type: 'button',
										onClick: this._onInstructionAdd
									},
									'Add'
								)
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'form-group' },
						_react2.default.createElement(
							'label',
							{ htmlFor: 'favorite' },
							'Favorite'
						),
						_react2.default.createElement('input', {
							name: 'favorite',
							className: 'form-control',
							checked: this.state.favorite,
							type: 'checkbox',
							onClick: this._toggleFavorite
						})
					),
					_react2.default.createElement(
						'div',
						{ className: 'form-group' },
						_react2.default.createElement(
							'label',
							{ htmlFor: 'notes' },
							'Notes'
						),
						_react2.default.createElement('textarea', {
							name: 'notes',
							className: 'form-control',
							value: this.state.notes,
							onInput: this._onNotesInput
						})
					),
					_react2.default.createElement('input', { type: 'submit', className: 'btn btn-primary btn-block', value: 'save' })
				);
			}
		}, {
			key: '_onTitleInput',
			value: function _onTitleInput(e) {
				if (typeof e.target.value === 'string') {
					this.setState({
						title: e.target.value
					});
				}
			}
		}, {
			key: '_onIngredientInput',
			value: function _onIngredientInput(e) {
				if (typeof e.target.value === 'string') {
					this.setState({
						ingredientInput: e.target.value
					});
				}
			}
		}, {
			key: '_onIngredientAdd',
			value: function _onIngredientAdd(e) {
				this.setState({
					ingredientInput: '',
					ingredients: [].concat(_toConsumableArray(this.state.ingredients), [{
						ingredient: this.state.ingredientInput,
						sequence: this.state.ingredients.length + 1
					}])
				});
			}
		}, {
			key: '_onInstructionInput',
			value: function _onInstructionInput(e) {
				if (typeof e.target.value === 'string') {
					this.setState({
						instructionInput: e.target.value
					});
				}
			}
		}, {
			key: '_onInstructionAdd',
			value: function _onInstructionAdd(e) {
				this.setState({
					instructionInput: '',
					instructions: [].concat(_toConsumableArray(this.state.instructions), [{
						instruction: this.state.instructionInput,
						sequence: this.state.instructions.length + 1
					}])
				});
			}
		}, {
			key: '_toggleFavorite',
			value: function _toggleFavorite(e) {
				this.setState({
					favorite: !this.state.favorite
				});
			}
		}, {
			key: '_onNotesInput',
			value: function _onNotesInput(e) {
				if (typeof e.target.value === 'string') {
					this.setState({
						notes: e.target.value
					});
				}
			}
		}, {
			key: '_onSubmit',
			value: function _onSubmit(e) {
				e.preventDefault();
				this.props.dispatch((0, _actions.saveRecipe)(this.state));

				this.setState({
					title: '',
					ingredientInput: '',
					ingredients: [],
					instructionInput: '',
					instructions: [],
					favorite: false,
					notes: ''
				});
			}
		}]);

		return AddRecipe;
	}(_react2.default.Component);

	AddRecipe = (0, _reactRedux.connect)()(AddRecipe);
	exports.default = AddRecipe;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.deleteRecipe = exports.getAllRecipes = exports.saveRecipe = exports.receivedAll = undefined;

	__webpack_require__(19);

	var hasErrored = function hasErrored(bool) {
	  return { type: "HAS_ERRORED", hasErrored: bool };
	};
	var isLoading = function isLoading(bool) {
	  return { type: "IS_LOADING", isLoading: bool };
	};
	var addRecipe = function addRecipe(recipe) {
	  return { type: "ADD_RECIPE", recipe: recipe };
	};
	var destroyRecipe = function destroyRecipe(recipeid) {
	  return { type: "DESTROY_RECIPE", recipeid: recipeid };
	};

	var receivedAll = exports.receivedAll = function receivedAll(data) {
	  return { type: "RECEIVED_ALL", recipes: data };
	};

	var saveRecipe = exports.saveRecipe = function saveRecipe(recipe) {
	  return function (dispatch) {
	    dispatch(isLoading(true));

	    fetch("api/saverecipe", {
	      method: "post",
	      headers: { "Content-Type": "application/json", Accept: "application/json" },
	      body: JSON.stringify(recipe)
	    }).then(function (res) {
	      if (!res.ok) throw Error(res.statusText);

	      dispatch(isLoading(false));
	      return res.json();
	    }).then(function (data) {
	      recipe.id = data.recipeid;
	      dispatch(addRecipe(recipe));
	    }).catch(function () {
	      return hasErrored(true);
	    });
	  };
	};

	var getAllRecipes = exports.getAllRecipes = function getAllRecipes() {
	  return function (dispatch) {
	    dispatch(isLoading(true));

	    fetch("api/recipes").then(function (res) {
	      if (!res.ok) throw Error(res.statusText);

	      dispatch(isLoading(false));
	      return res.json();
	    }).then(function (data) {
	      return dispatch(receivedAll(data.recipes));
	    }).catch(function () {
	      return hasErrored(true);
	    });
	  };
	};

	var deleteRecipe = exports.deleteRecipe = function deleteRecipe(id) {
	  return function (dispatch) {
	    console.log(JSON.stringify(id));
	    fetch("deleterecipe", {
	      method: "post",
	      headers: { "Content-Type": "application/json", Accept: "application/json" },
	      body: JSON.stringify({ recipeId: id })
	    }).then(function () {
	      return dispatch(destroyRecipe(id));
	    }).catch(function () {
	      return hasErrored(true);
	    });
	  };
	};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	module.exports = require("whatwg-fetch");

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(11);

	var _react2 = _interopRequireDefault(_react);

	var _RecipeCard = __webpack_require__(21);

	var _RecipeCard2 = _interopRequireDefault(_RecipeCard);

	var _reactRedux = __webpack_require__(13);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var mapStateToProps = function mapStateToProps(state) {
	  return { recipes: state.recipes };
	};

	var Recipes = function Recipes(_ref) {
	  var recipes = _ref.recipes;
	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(
	      'ul',
	      { className: 'list-group' },
	      recipes.map(function (recipe) {
	        return _react2.default.createElement(_RecipeCard2.default, _extends({
	          key: recipe.id
	        }, recipe));
	      })
	    )
	  );
	};

	exports.default = (0, _reactRedux.connect)(mapStateToProps)(Recipes);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(11);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouterDom = __webpack_require__(15);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var RecipeCard = function RecipeCard(_ref) {
	  var title = _ref.title,
	      id = _ref.id;
	  return _react2.default.createElement(
	    'li',
	    { className: 'list-group-item' },
	    _react2.default.createElement(
	      'div',
	      { className: 'col-sm-8' },
	      _react2.default.createElement(
	        'h4',
	        { className: 'card-title' },
	        title
	      ),
	      _react2.default.createElement(
	        'p',
	        { className: 'card-text' },
	        'Maybe some description'
	      )
	    ),
	    _react2.default.createElement(
	      'div',
	      { className: 'col-sm-4' },
	      _react2.default.createElement(
	        _reactRouterDom.Link,
	        { to: '/recipes/' + id, className: 'btn btn-primary' },
	        'Make it'
	      )
	    )
	  );
	};

	exports.default = RecipeCard;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(11);

	var _react2 = _interopRequireDefault(_react);

	var _reactRedux = __webpack_require__(13);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var mapStateToProps = function mapStateToProps(state) {
	  return _extends({}, state.auth);
	};

	var mapDispatchToProps = function mapDispatchToProps(dispatch) {
	  return {
	    onEmailInput: function onEmailInput(value) {
	      return dispatch({ type: "UPDATE_FIELD_AUTH", key: "email", value: value });
	    },
	    onPasswordInput: function onPasswordInput(value) {
	      return dispatch({ type: "UPDATE_FIELD_AUTH", key: "password", value: value });
	    }
	  };
	};

	var Login = function (_React$Component) {
	  _inherits(Login, _React$Component);

	  function Login() {
	    _classCallCheck(this, Login);

	    var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this));

	    _this._onEmailInput = function (e) {
	      return _this.props.onEmailInput(e.target.value);
	    };
	    _this._onPasswordInput = function (e) {
	      return _this.props.onPasswordInput(e.target.value);
	    };
	    _this._onSubmit = function () {
	      return console.log("submit");
	    };
	    return _this;
	  }

	  _createClass(Login, [{
	    key: "render",
	    value: function render() {
	      return _react2.default.createElement(
	        "div",
	        null,
	        _react2.default.createElement(
	          "form",
	          { onSubmit: this._onSubmit, className: "form" },
	          _react2.default.createElement(
	            "div",
	            { className: "form-group" },
	            _react2.default.createElement(
	              "label",
	              { htmlFor: "recipe-title" },
	              "Email"
	            ),
	            _react2.default.createElement("input", {
	              type: "text",
	              name: "email",
	              onChange: this._onEmailInput,
	              value: this.props.email,
	              className: "form-control",
	              placeholder: "Enter your email"
	            })
	          ),
	          _react2.default.createElement(
	            "div",
	            { className: "form-group" },
	            _react2.default.createElement(
	              "label",
	              { htmlFor: "recipe-title" },
	              "Password"
	            ),
	            _react2.default.createElement("input", {
	              type: "text",
	              name: "password",
	              onChange: this._onPasswordInput,
	              value: this.props.password,
	              className: "form-control",
	              placeholder: "Enter your password"
	            })
	          ),
	          _react2.default.createElement(
	            "a",
	            { className: "btn btn-secondary", type: "button", href: "/auth/google" },
	            "Authenticate"
	          )
	        )
	      );
	    }
	  }]);

	  return Login;
	}(_react2.default.Component);

	exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Login);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(11);

	var _react2 = _interopRequireDefault(_react);

	var _lodash = __webpack_require__(24);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _reactRedux = __webpack_require__(13);

	var _actions = __webpack_require__(18);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var mapStateToProps = function mapStateToProps(state, ownProps) {
	  var found = _lodash2.default.find(state.recipes, { id: parseInt(ownProps.match.params.id, 10) });

	  return {
	    recipe: found
	  };
	};

	var mapDispatchToProps = function mapDispatchToProps(dispatch) {
	  return {
	    onDeleteRecipe: function onDeleteRecipe(id) {
	      return dispatch((0, _actions.deleteRecipe)(id));
	    }
	  };
	};

	var Recipe = function Recipe(_ref) {
	  var recipe = _ref.recipe,
	      onDeleteRecipe = _ref.onDeleteRecipe;

	  var ingredientsElement = recipe.ingredients ? recipe.ingredients.map(function (ing, index) {
	    return _react2.default.createElement(
	      'li',
	      { key: index },
	      ing.ingredient
	    );
	  }) : 'No ingredients';

	  var instructionsElement = recipe.instructions ? recipe.instructions.map(function (ins, index) {
	    return _react2.default.createElement(
	      'li',
	      { key: index },
	      ins.instruction
	    );
	  }) : 'No instructions';

	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement(
	      'h4',
	      null,
	      recipe.title
	    ),
	    _react2.default.createElement(
	      'p',
	      { className: 'lead' },
	      recipe.notes
	    ),
	    _react2.default.createElement(
	      'div',
	      { className: 'row' },
	      _react2.default.createElement(
	        'div',
	        { className: 'col-sm-3' },
	        _react2.default.createElement(
	          'h5',
	          null,
	          'Ingredients'
	        ),
	        _react2.default.createElement(
	          'ol',
	          null,
	          ingredientsElement
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'col-sm-9' },
	        _react2.default.createElement(
	          'h5',
	          { className: 'card-title' },
	          'Instructions'
	        ),
	        _react2.default.createElement(
	          'ol',
	          null,
	          instructionsElement
	        )
	      )
	    ),
	    _react2.default.createElement(
	      'h5',
	      null,
	      'Favorite'
	    ),
	    _react2.default.createElement(
	      'p',
	      null,
	      recipe.favorite ? 'true' : 'false'
	    ),
	    _react2.default.createElement(
	      'h5',
	      null,
	      'Notes'
	    ),
	    _react2.default.createElement(
	      'p',
	      null,
	      recipe.notes
	    ),
	    _react2.default.createElement(
	      'button',
	      { className: 'btn btn-secondary', onClick: function onClick() {
	          return onDeleteRecipe(recipe.id);
	        } },
	      'Delete'
	    )
	  );
	};

	exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Recipe);

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	module.exports = require("lodash");

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _redux = __webpack_require__(12);

	var _recipes = __webpack_require__(26);

	var _recipes2 = _interopRequireDefault(_recipes);

	var _fetchStatus = __webpack_require__(27);

	var _fetchStatus2 = _interopRequireDefault(_fetchStatus);

	var _auth = __webpack_require__(28);

	var _auth2 = _interopRequireDefault(_auth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var recipeApp = (0, _redux.combineReducers)({ recipes: _recipes2.default, fetchStatus: _fetchStatus2.default, auth: _auth2.default });

	exports.default = recipeApp;

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var recipe = function recipe(state, action) {
	  switch (action.type) {
	    case 'ADD_RECIPE':
	      return {
	        id: action.recipe.id,
	        title: action.recipe.title,
	        ingredients: action.recipe.ingredients,
	        instructions: action.recipe.instructions,
	        notes: action.recipe.notes,
	        favorite: action.recipe.favorite
	      };
	    default:
	      return state;

	  }
	};

	var recipes = function recipes() {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	  var action = arguments[1];

	  switch (action.type) {
	    case 'ADD_RECIPE':
	      return [].concat(_toConsumableArray(state), [recipe(undefined, action)]);
	    case 'RECEIVED_ALL':
	      return [].concat(_toConsumableArray(action.recipes));
	    case 'DESTROY_RECIPE':
	      return state.filter(function (recipe) {
	        return recipe.id !== action.recipeid;
	      });
	    default:
	      return state;
	  }
	};

	exports.default = recipes;

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	  var action = arguments[1];

	  switch (action.type) {
	    case 'IS_LOADING':
	      return action.isLoading;
	    case 'HAS_ERRORED':
	      return action.hasErrored;
	    default:
	      return state;
	  }
	};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	exports.default = function () {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var action = arguments[1];

		switch (action.type) {
			case 'UPDATE_FIELD_AUTH':
				return _extends({}, state, _defineProperty({}, action.key, action.value));
			default:
				return state;
		}
	};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	module.exports = require("react-dom/server");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  googleAuth: {
	    clientID: "992563509206-d36ti5384mj30q5b76a2km05dld3v6ja.apps.googleusercontent.com",
	    clientSecret: "CZd6o82LZXCTaepXbwBXBk5S",
	    callbackURL: "http://localhost:8080/auth/google/callback"
	  }
	};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = require("passport");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

	module.exports = require("passport-google-oauth");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	module.exports = require("connect-flash");

/***/ })
/******/ ]);