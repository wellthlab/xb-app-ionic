 /**
    Invoked in the onNewExperimentSubscription function. Given the milliseconds offset between the time of a device
    and UTC, will return the UTC time (milliseconds since January 1, 1970) when the start of day (8AM device time)
    and end of day reminders (9PM device time) should be sent to the device.
  **/

exports = function(deviceOffsetFromUTCMilliSecs) {
    const date = new Date();
    const localTimeMinutesSinceMidnight = (date.getHours() * 60) + date.getMinutes();

    let minutesUntil8am =  480 - localTimeMinutesSinceMidnight;
    if (minutesUntil8am < 0) {
        // If it's already past 8AM, then the reminders won't be sent until the next day
        minutesUntil8am = minutesUntil8am + (24 * 60);
    }

    const milliSecsUntil8am = minutesUntil8am * 60 * 1000;
    const milliSecsUntil9pm = milliSecsUntil8am + (13 * 60 * 60 * 1000);

    const UTCAdjustedByLocalOffset = Date.now() - (date.getTimezoneOffset() * 60 * 1000);
    const UTCAdjustedByLocalAndDeviceOffset = UTCAdjustedByLocalOffset + deviceOffsetFromUTCMilliSecs;

    return [UTCAdjustedByLocalAndDeviceOffset + milliSecsUntil8am, UTCAdjustedByLocalAndDeviceOffset + milliSecsUntil9pm ];
};
