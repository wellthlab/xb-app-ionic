import "babel-polyfill";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import { setupIonicReact } from "@ionic/react";

import { Provider } from "react-redux";

// The redux model for the app
import store from "./util_model/store";

import XBClient from "./util_model/client";

// Controllers, for doing things to the model easily
import ControllerContext, { getControllers } from "./util_model/controllers";

setupIonicReact();

// Create a new set of controllers, bound to the redux store and a fresh API client
var controllers = getControllers(store, new XBClient());

ReactDOM.render(
  <Provider store={store}>
    <ControllerContext.Provider value={controllers}>
      <App />
    </ControllerContext.Provider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);
