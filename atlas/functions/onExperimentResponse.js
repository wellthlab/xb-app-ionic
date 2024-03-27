/**
 * Invoked by a MongoDB database trigger. Given an insert on the responses collection (i.e when the user completes a task)
 * checks to see if reminders should still be sent to the user, if not it deletes all entries corresponding to the user's ID
 * in the pendingNotifications collection
 **/

exports = async function(changeEvent) {
    const response = changeEvent.fullDocument;
    const mongodb = context.services.get('mongodb-atlas').db('PRODUCTION');

    const shouldContinueRemindersForAccount = await context.functions.execute('shouldContinueRemindersForAccount', response.userId, mongodb);

    if (!shouldContinueRemindersForAccount) {
        await mongodb.collection('pendingNotifications').deleteMany({ userId:  response.userId });
    }
};
