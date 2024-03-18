import { BaseModel } from './utils';
import { fcmService } from '../index';
import { IAccountDocument } from './Account';
import { Device } from '@capacitor/device';

export class AppDevice extends BaseModel {
    static async updateDeviceInfo () {
        const db = this.getDb();

        const accountId = this.client.currentUser!.id;
        const deviceId = await Device.getId();
        const deviceFCMToken = fcmService.getFCMDeviceToken();

        if (deviceFCMToken) {
            await db.collection<IAccountDocument>('devices').updateOne(
                { _id: deviceId.identifier},
                {
                    $set: { accountId: this.oid(accountId), fcmToken: deviceFCMToken,  fcmTokenLastRetrievedTime: Date.now() },
                },
                { upsert: true },
            );
        }
    }
}
