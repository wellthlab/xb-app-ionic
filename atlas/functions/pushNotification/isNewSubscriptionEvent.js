// Invoked in the onNewExperimentSubscription function. Given an event on the accounts collection, checks if the event corresponds
// to a new subscription by comparing the number of subscriptions for the account before and after the event.

exports = function(changeEvent) {
    const subscriptionsBeforeEvent = changeEvent.fullDocumentBeforeChange?.subscriptions?.length;
    const subscriptionsAfterEvent = changeEvent.fullDocument?.subscriptions?.length;

    if (subscriptionsBeforeEvent !== undefined && subscriptionsAfterEvent !== undefined) {
        return subscriptionsAfterEvent > subscriptionsBeforeEvent;
    } else {
        return false;
    }
};
