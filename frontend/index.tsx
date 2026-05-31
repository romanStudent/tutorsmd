"use strict";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './src/shared/config/i18n';
import { store } from './src/app/store';
import { App } from './src/app/App';

import "./input.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>,
);
