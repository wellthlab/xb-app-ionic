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
import { Capacitor } from '@capacitor/core';

setupIonicReact();
defineCustomElements(window);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

export const fcmService = new FCMService();

// Don't register FCM on web platform as it is not supported and will throw an error if attempted
if (Capacitor.getPlatform() !== 'web') {
    //set up firebase cloud messaging listeners
    fcmService.registerNotifications();
    fcmService.addListeners();
} else {
    console.warn('Push Notifications are not supported on web platform; not registering that plugin');
}



ReactDOM.render(<App />, document.getElementById('root'));
