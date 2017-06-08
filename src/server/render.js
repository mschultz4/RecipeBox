// Universal App setup
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import App from "../shared/components/App.js";
import rootReducer from "../shared/reducers/root";
import { StaticRouter, browserHistory, Route } from "react-router-dom";
import { receivedAll } from "../shared/actions/actions";
import { renderToString } from "react-dom/server";
import queries from "./queries.js";

const context = {};

function renderFullPage(html, preloadedState) {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Recipe Box</title>

    <link href='/static/styles.css' rel='stylesheet'>
    <script src="https://use.fontawesome.com/2cfba22f5a.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js"></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
      crossorigin="anonymous">
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn"
      crossorigin="anonymous"></script>
    <!--<script src="https://unpkg.com/react@15.3.0/dist/react.js"></script>
    <script src="https://unpkg.com/react-dom@15.3.0/dist/react-dom.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.15.0/lodash.min.js"></script>-->
  </head>
  <body>
    <div id="root">${html}</div>
    <script>
      // WARNING: See the following for security issues around embedding JSON in HTML:
      // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, "\\u003c")}
    </script>
    <script src="/static/bundle.js"></script>
  </body>
  </html>`;
}

export default function render(url, db, res) {
  // Create a new Redux store instance
  const store = createStore(rootReducer);

  db
    .one(queries.selectRecipes)
    .then(data => {
      store.dispatch(
        receivedAll(data.recipes)
      );

      // Render the component to a string
      const html = renderToString(
        <Provider store={store}>
          <StaticRouter context={context} location={url}>
            <App />
          </StaticRouter>
        </Provider>
      );

      // Grab the initial state from our Redux store
      const preloadedState = store.getState();
      console.log(preloadedState);
      // Send the rendered page back to the client
      res.send(renderFullPage(html, preloadedState));
    })
    .catch(error => console.log(error));
}
