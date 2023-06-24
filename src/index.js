import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import "react-notifications/lib/notifications.css";
import "./index.scss";
import mixpanel from "mixpanel-browser";
import { BrowserRouter as Router } from "react-router-dom";
// mixpanel.init("21f42c6e5bf4444d40583b6a127d0707"); //TODO:

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
