import React from 'react';
import ReactDOM from 'react-dom';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { setupIonicReact } from '@ionic/react';

import App from './App';
import * as serviceWorker from './serviceWorker';

// Core CSS required for Ionic components to work properly

import '@ionic/react/css/core.css';

// Basic CSS for apps built with Ionic

import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import './app.css';
import { FCMService } from './services/fcm/fcmService';

setupIonicReact();
defineCustomElements(window);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

//set up firebase cloud messaging listeners
export const fcmService = new FCMService();
fcmService.registerNotifications();
fcmService.addListeners();

ReactDOM.render(<App />, document.getElementById('root'));
