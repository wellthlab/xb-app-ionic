/**
 * Is invoked by a scheduled MongoDB Atlas trigger. It looks in the scheduledExperiments collections for scheduled experiments with a start-time
 * on or before the current time and subscribes the specified user to those experiments
 **/

exports = async function() {
    const mongodb = context.services.get('mongodb-atlas').db('PRODUCTION');
    const scheduledExperiments =  await mongodb.collection('scheduledExperiments').find({ startTimeUTC: { $lte: Date.now()}}).toArray();

    if (scheduledExperiments.length > 0) {
        const scheduledExperimentsGroupedByAccountId= scheduledExperiments.reduce((map, scheduledExperiment) => {
            if (map.has(scheduledExperiment.userId)) {
                map.get(scheduledExperiment.userId).push(scheduledExperiment);
            } else {
                map.set(scheduledExperiment.userId, [scheduledExperiment]);
            }
            return map;
        }, new Map());

        for (const [accountId, entries] of scheduledExperimentsGroupedByAccountId.entries()) {
            const newSubscriptions = [];
            for (const entry of entries) {
                const subscribedAt = entry.startTimeUTC;
                for (const experimentId of entry.experiments) {

                    newSubscriptions.push({
                        experimentId: experimentId,
                        subscribedAt: subscribedAt
                    });
                }
            }

            const insertedIds = (await mongodb.collection('subscriptions').insertMany(newSubscriptions, { ordered: false })).insertedIds;
            await mongodb.collection('accounts').updateOne(
                { _id: accountId, },
                {
                    $push: {
                        subscriptions: { $each: insertedIds},
                    },
                },
            );
        }

        const scheduledExperimentIds = scheduledExperiments.map(scheduledExperiment => scheduledExperiment._id);
        await mongodb.collection('scheduledExperiments').deleteMany({ _id: { $in: scheduledExperimentIds } });
    }
};
