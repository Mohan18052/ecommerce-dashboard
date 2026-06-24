import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";

import {
  PersistGate,
} from "redux-persist/integration/react";

import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
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
        loading={null}
        persistor={persistor}
      >
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);