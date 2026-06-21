import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";

import {
  PersistGate,
} from "redux-persist/integration/react";

import App from "./App";
import "./index.css";

import {
  store,
  persistor,
} from "./app/store";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={<h1>Loading...</h1>}
        persistor={persistor}
      >
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);