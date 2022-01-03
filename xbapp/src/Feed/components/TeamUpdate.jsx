import React from 'react';

import {
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonButton,
} from "@ionic/react";

const TeamUpdate = (props) => {

    const item = props.item;
    const othersCount = item.update.count - Number(item.update.hasOwn);

    return item.update.count > 0 ? (
        <>
            <IonCardHeader>
                <IonCardSubtitle>Team update</IonCardSubtitle>
                <IonCardTitle>
                    Team {item.team}&apos;s news
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <p>
                    {othersCount === 0 ?
                        `You are the first person to complete ${item.update.display} ${timeFromNow(item.date)} - Well done` :
                        `${item.update.hasOwn ? "You and " : ""} ${othersCount} other ${formatWord(othersCount, 'member')} in this team have completed ${item.update.display} ${timeFromNow(item.date)}`}
                </p>
                {!item.update.hasOwn && isToday(item.date) ? <IonButton href="/box/move">Complete {item.update.display} now!</IonButton> : null}
            </IonCardContent>
        </>
    ) : null;
};

const formatWord = function (count, word) {

    return count > 1 ? word + 's' : word;
}

const isToday = function (ts) {

    const current = new Date();

    return current.setHours(0, 0, 0, 0) === new Date(ts).setHours(0, 0, 0, 0);
}

const timeFromNow = function (ts) {

    const elapsed = Date.now() - ts;
    const msPerDay = 24 * 60 * 60 * 1000;

    const thresholds = {
        day: msPerDay,
        week: msPerDay * 7,
        month: msPerDay * 30,
        year: msPerDay * 365,
        last: Infinity,
    };

    console.log('timeFromNow', elapsed);

    const entries = Object.entries(thresholds);

    for (let i = 0; i < entries.length; i++) {
        const [, threshold] = entries[i];

        if (elapsed < threshold) {
            if (i === 0) {
                return 'today';
            }

            const [prevWord, prevThreshold] = entries[i - 1];

            const roundedTime = Math.floor(elapsed / prevThreshold);
            return roundedTime + ' ' + formatWord(roundedTime, prevWord) + ' ago';
        }
    }
};

export default TeamUpdate;