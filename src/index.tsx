import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import App from './App';
import { setupProject } from "./utils/project-setup";
import reportWebVitals from './reportWebVitals';
import store from './redux/store';
import './index.css';

setupProject({
  rootElement: (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  injectExtensionTo: "body",
  injectWebAppTo: "#root",
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
