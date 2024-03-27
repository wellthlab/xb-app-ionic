/**
 * Invoked by a MongoDB database trigger. Given an event on the accounts collection, if the event is a subscription to
 * an experiment and the experiment is marked as requiring reminders, it creates entries in the pendingNotifications collection
 * specifying  when the notification should be sent and what devices it should be sent to.
 **/

exports = async function(changeEvent) {
    const isNewSubscriptionEvent = context.functions.execute('isNewSubscriptionEvent', changeEvent);

    if (isNewSubscriptionEvent) {
        const newSubscription = changeEvent.fullDocument.subscriptions[changeEvent.fullDocument.subscriptions.length - 1];
        const mongodb = context.services.get('mongodb-atlas').db('PRODUCTION');
        const experiment = await mongodb.collection('experiments').findOne({ _id: newSubscription.experimentId });

        if (experiment.shouldSendReminders) {
            const devices = await mongodb.collection('devices').find({ userId: changeEvent.fullDocument._id }, {
                fcmToken: 1,
                timezoneUTCOffsetMilliSecs: 1,
            }).toArray();

            if (devices.length > 0) {
                const notifications = [];

                for (const device of devices) {
                    const [timeToSendStartOfDayReminder, timeToSendEndOfDayReminder] = context.functions.execute('getUTCTimeToSendReminders', device.timezoneUTCOffsetMilliSecs);
                    notifications.push(
                        {
                            notificationTitle: 'START_OF_DAY_REMINDER',
                            fcmToken: device.fcmToken,
                            timeToSendUTC: timeToSendStartOfDayReminder,
                            userId: changeEvent.fullDocument._id,
                        },
                        {
                            notificationTitle: 'END_OF_DAY_REMINDER',
                            fcmToken: device.fcmToken,
                            timeToSendUTC: timeToSendEndOfDayReminder,
                            userId: changeEvent.fullDocument._id,
                        },
                    );
                }

                await mongodb.collection('pendingNotifications').insertMany(notifications, { ordered: false });
            }

        }
    }
};
