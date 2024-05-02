import Strings from '../../utils/string_dict.js';
import { PushNotifications } from '@capacitor/push-notifications';

export const FCMService = class {
    private fcmDeviceToken: string | undefined;

    async addListeners() {
        await PushNotifications.addListener('registration', token => {
            this.fcmDeviceToken = token.value;
        });
    }

     async registerNotifications() {
         let permStatus = await PushNotifications.checkPermissions();

         if (permStatus.receive === 'prompt') {
             permStatus = await PushNotifications.requestPermissions();
         }

         if (permStatus.receive !== 'granted') {
             throw new Error(Strings.user_denied_permissions);
         }

         await PushNotifications.register();
     }

    getFCMDeviceToken = () => {
        return this.fcmDeviceToken;
    }
}

