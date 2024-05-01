exports = async function() {
    const mongodb = context.services.get('mongodb-atlas').db('PRODUCTION');
    const subscriptionSequencesForUpdate =  await mongodb.collection('subscriptionSequences').find({ nextUpdateTimeUTC: { $lte: Date.now() }, $expr: { $lt : [ "$nextSequenceIndex" , "$experimentSequence.length"]} }).toArray();

    for (const subscriptionSequence of subscriptionSequencesForUpdate) {
        const experimentsForSubscription = subscriptionSequence.experimentSequence[subscriptionSequence.nextSequenceIndex];
        const account = await mongodb.collection('accounts').findOne({ _id: subscriptionSequence.userId });
        const newSubscriptions = [];
        const subscribedAt = Date.now();

        for (const experimentId of experimentsForSubscription) {
            const experiment = await mongodb.collection('experiments').findOne({_id: experimentId}, {children: 1});

            if (experiment.children) {
                experiment.children.forEach((child) => {
                    newSubscriptions.push({
                        experimentId: child,
                        subscribedAt: subscribedAt
                    });
                })
            } else {
                newSubscriptions.push({
                    experimentId: experimentId,
                    subscribedAt: subscribedAt
                });
            }
        }
        const insertedIds = (await mongodb.collection('subscriptions').insertMany(newSubscriptions, { ordered: false })).insertedIds;

        await mongodb.collection('accounts').updateOne(
            { _id: account._id, },
            {
                $push: {
                    subscriptions: { $each: insertedIds},
                },
            },
        );
    }

    const oneWeekInMillisecs = 7 * 24 * 60 * 60 * 1000;
    if (subscriptionSequencesForUpdate.length > 0 ) {
        await mongodb.collection('subscriptionSequences').updateMany({ _id:  { $in: subscriptionSequencesForUpdate.map((s) => s._id) } }, { $inc: { nextUpdateTimeUTC: oneWeekInMillisecs, nextSequenceIndex: 1  }});
    }
};
