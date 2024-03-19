 /* This function is uploaded on mongo-db atlas where it is invoked by a mongo-db trigger and runs as a serverless function.
 *  Sends push notification specified by a given title to all devices belonging to the users having Ids specified in userIds array
 * */

exports = async function (userIds, notificationTitle) {
    const admin = require("firebase-admin");
    const firebaseCredentials = context.values.get("fireBaseKey");
    const cert = JSON.parse(firebaseCredentials);
    admin.initializeApp({
        credential: admin.credential.cert(cert),
    });

    const userIdsAsObjectId = userIds.map(userId => new BSON.ObjectId(userId));
    const mongodb = context.services.get("mongodb-atlas").db("DEVELOPMENT"); // TO-DO - can DB instance be determined by a mongodb env variable instead of hardcoding?
    const deviceTokens = await mongodb.collection('devices').distinct('fcmToken', {accountId: {$in: userIdsAsObjectId}});

    const pushNotifications = context.values.get("pushNotifications");
    const notification = pushNotifications[notificationTitle];

    const maxNumTokensInRequest = 500; // Notifications can be sent to a maximum of 500 devices at once
    const failedTokens = [];

    for (let i = 0; i < deviceTokens.length; i += maxNumTokensInRequest) {
        const batchTokens = deviceTokens.slice(i, i + maxNumTokensInRequest);

        const message = {
            notification: {
                title: notification.title,
                body: notification.body
            },
            tokens: batchTokens
        };

        await admin.messaging()
            .sendMulticast(message)
            .then((response) => {
                if (response.failureCount > 0) {
                    response.responses.forEach((resp, idx) => {
                        if (!resp.success && (resp.error?.code === "messaging/invalid-argument"  || resp.error?.code === "messaging/registration-token-not-registered")) {
                            // If message sending failed, then token for the device is no longer valid and should be removed from db.
                            failedTokens.push(batchTokens[idx]);
                        }
                    });
                }
            }).catch((error) => {
                console.log("Error sending message:", error);
            });
    }

    if (failedTokens.length > 0) {
        await mongodb.collection('devices').deleteMany({ fcmToken: {$in: failedTokens}});
    }
};
