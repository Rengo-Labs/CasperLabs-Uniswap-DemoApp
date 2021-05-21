import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import App from "./app/containers/App/Application";
import axios from "axios";

// axios.defaults.withCredentials = true;

if (process.env.REACT_APP_BACKEND_SERVER_ADDRESS)
  axios.defaults.baseURL = `${process.env.REACT_APP_BACKEND_SERVER_ADDRESS}`;
// else axios.defaults.baseURL = `http://localhost:3000`;
else axios.defaults.baseURL = `https://robot-drop-backend.herokuapp.com/`;

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// import React from "react";
// import ReactDOM from "react-dom";
// // import { BrowserRouter, Route, Switch } from "react-router-dom";
// import "./index.css";
// import * as serviceWorker from "./serviceWorker";
// import { BrowserRouter } from "react-router-dom";
// // import ErrorScreen from "./components/ErrorScreen";
// // import AdminDashboard from "./components/AdminDashboard";
// import App from "./App";

// ReactDOM.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>,
//     document.getElementById('root')
// );

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
