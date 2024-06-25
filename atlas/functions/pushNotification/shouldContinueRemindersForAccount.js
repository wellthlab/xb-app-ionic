/**
 * Invoked in the onExperimentResponse function. Given a userId, checks if we should continue sending reminders
 * to the user by checking to see if the user is subscribed to any experiments where 1) the experiment is marked as requiring notifications
 * 2) the user has not completed all the tasks in the experiment
 **/

exports = async function(account, mongodb) {
    for (let subscriptionId of account.subscriptions) {
        const subscription = await mongodb.collection('subscriptions').findOne({ _id: subscriptionId });
        const experiment = await mongodb.collection('experiments').findOne({ _id: subscription.experimentId });
        const responses = await mongodb.collection('responses').find({ subscriptionId: subscriptionId }).toArray();

        if (!('children' in experiment)) {
            const originalLength = experiment.days.length;
            if (originalLength < experiment.duration) {
                let day = 0;

                for (let i = 0; i < experiment.duration - originalLength; i++) {
                    experiment.days.push(experiment.days[day]);
                    day++;

                    if (day === originalLength) {
                        day = 0;
                    }
                }
            }
        }

        let isFinished = true;

        taskLoop: for (const [dayIndex, day] of experiment.days.entries()) {
            for (const task of day.tasks) {
                if (!(responses.some(response => response.taskId.toString() === task.taskId.toString() && response.dayNum === dayIndex && !response.inactiveSubscription))) {
                    isFinished = false;
                    break taskLoop;
                }
            }
        }

        if (!isFinished && experiment.shouldSendReminders) {
            return true;
        }
    }

    return false;
};
