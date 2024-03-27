/**
 * Is invoked by a scheduled MongoDB Atlas trigger. It looks in the pendingNotifications collections for all notifications
 * which are due to be sent out and then calls the sendPushNotifications function to send them out. It then increments the timeToSendUTC field for the notifications,
 * so that they are sent out again in the next 24 hours.
 **/

exports = async function() {
    const mongodb = context.services.get('mongodb-atlas').db('PRODUCTION');
    const notificationsForDispatch = await mongodb.collection('pendingNotifications').find({ timeToSendUTC: { $lte: Date.now() } }).toArray();

    if (notificationsForDispatch.length > 0) {

        const fcmTokensGroupedByNotificationTitle = notificationsForDispatch.reduce((map, notificationInfo) => {
            if (map.has(notificationInfo.notificationTitle)) {
                map.get(notificationInfo.notificationTitle).push(notificationInfo.fcmToken);
            } else {
                map.set(notificationInfo.notificationTitle, [notificationInfo.fcmToken]);
            }
            return map;
        }, new Map());

        for (const [notificationTitle, fcmTokens] of fcmTokensGroupedByNotificationTitle.entries()) {
            await context.functions.execute('sendPushNotifications', notificationTitle, fcmTokens);
        }

        const notificationIds = notificationsForDispatch.map(notificationInfo => notificationInfo._id);
        const oneDayInMilliSecs = 24 * 60 * 60 * 1000;
        await mongodb.collection('pendingNotifications').updateMany({ _id: { $in: notificationIds } }, { $inc: { timeToSendUTC: oneDayInMilliSecs } });
    }
};
