"use strict";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { LanguageProvider } from "./app/context/LanguageContext.tsx";
import { store } from './app/store.ts';
import { App } from './app/App.tsx';

import './app/styles/global.css';
import "./output.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
     <LanguageProvider>
        <App />
     </LanguageProvider>
    </Provider>
  </React.StrictMode>,
);


