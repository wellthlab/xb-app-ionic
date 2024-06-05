import { BaseModel } from './utils';
import { fcmService } from '../index';
import { IAccountDocument } from './Account';
import { Device } from '@capacitor/device';

export class AppDevice extends BaseModel {
    static async updateDeviceInfo() {
        const db = this.getDb();

        const userId = this.client.currentUser!.id;
        const deviceId = await Device.getId();
        const deviceFCMToken = fcmService.getFCMDeviceToken();
        const deviceUTCOffsetMilliSecs = new Date().getTimezoneOffset() * 60 * 1000;

        if (deviceFCMToken) {
            await db.collection<IAccountDocument>('devices').updateOne(
                { _id: deviceId.identifier },
                {
                    $set: {
                        userId: this.oid(userId),
                        fcmToken: deviceFCMToken,
                        fcmTokenLastRetrievedTime: Date.now(),
                        timezoneUTCOffsetMilliSecs: deviceUTCOffsetMilliSecs,
                    },
                    $setOnInsert: { _id: deviceId.identifier },
                },
                { upsert: true },
            );
        }
    }
}
