import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// @ts-ignore
import App from "./App";
// @ts-ignore
import reportWebVitals from "./reportWebVitals";

// Add a type assertion for the root element
const rootElement = document.getElementById("root") as HTMLElement;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
