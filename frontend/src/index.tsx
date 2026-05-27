"use strict";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from './app/store';
import { App } from './app/App';

import './shared/lib/i18n';   // инициализация языка
import './app/styles/global.css';
import "./output.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>,
);


