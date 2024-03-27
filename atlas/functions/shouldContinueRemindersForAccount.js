/**
 * Invoked in the onExperimentResponse function. Given a userId, checks if we should continue sending reminders
 * to the user by checking to see if the user is subscribed to any experiments where 1) the experiment is marked as requiring notifications
 * 2) the user has not completed all the tasks in the experiment
 **/

exports = async function(userId, mongodb) {
    const account = await mongodb.collection('accounts').findOne({ _id: userId });

    for (const subscription of account.subscriptions) {
        const experiment = await mongodb.collection('experiments').findOne({ _id: subscription.experimentId });

        const isUnfinised = subscription.progress.some((taskList) => taskList.some((isDone) => !isDone));
        const requiresNotifications = experiment.shouldSendReminders;

        if (isUnfinised && requiresNotifications) {
            return true;
        }
    }

    return false;
};
