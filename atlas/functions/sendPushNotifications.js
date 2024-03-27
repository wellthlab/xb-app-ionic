/**
 * Is invoked by the handlePendingNotifications function. Given a notification title and a list of fcmTokens, it sends the
 * notification to the devices specified by the tokens.
 **/

exports = async function (notificationTitle, fcmTokens) {
    const admin = require("firebase-admin");
    const firebaseCredentials = context.values.get("firebaseCredentialsSecret");
    const cert = JSON.parse(firebaseCredentials);
    if (admin.apps.length === 0 ) {
        admin.initializeApp({
            credential: admin.credential.cert(cert),
        });
    }

    const mongodb = context.services.get("mongodb-atlas").db("PRODUCTION");

    const pushNotifications = context.values.get("pushNotifications");
    const notification = pushNotifications[notificationTitle];

    // Maximum number of devices to which FCM can send notifications simultaneously to is 500
    const maxNumTokensInRequest = 500;
    const failedTokens = [];

    for (let i = 0; i < fcmTokens.length; i += maxNumTokensInRequest) {
        const batchTokens = fcmTokens.slice(i, i + maxNumTokensInRequest);

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
                            // If FCM couldn't send the notification, then the device token is no longer valid and needs to be cleared from DB.
                            failedTokens.push(batchTokens[idx]);
                        }
                    });
                }
            }).catch((error) => {
                console.log("Error sending message:", error);
            });
    }

    if (failedTokens.length > 0) {
        // removing invalid tokens
        await mongodb.collection('devices').deleteMany({ fcmToken: {$in: failedTokens}});
    }
};
