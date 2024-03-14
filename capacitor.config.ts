// <reference types="@capacitor/splash-screen" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'uk.ac.soton.ecs.xbapp',
    appName: 'xbapp',
    webDir: 'build',
    bundledWebRuntime: false,
    plugins: {
        SplashScreen: {
            launchAutoHide: false,
        },
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"]
        }
    },
    android: {
        allowMixedContent: true,
        webContentsDebuggingEnabled: true,
    },
    cordova: {},
};

export default config;
