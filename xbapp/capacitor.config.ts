// <reference types="@capacitor/local-notifications" />
// <reference types="@capacitor/push-notifications" />
// <reference types="@capacitor/splash-screen" />

import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "uk.ac.soton.ecs.xbapp",
  appName: "xbapp",
  webDir: "build",
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#CE0B7C",
    },
    PushNotifications: {
      presentationOptions: ["alert", "sound"],
    },
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
  },
  cordova: {},
};

export default config;
