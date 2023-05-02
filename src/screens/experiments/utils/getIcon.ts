import React from 'react';
import { NotePencil, Camera, Heartbeat, Timer, Alarm, Barbell } from 'phosphor-react';

const iconComponentMap: Record<string, React.ComponentType> = {
    barbell: Barbell,
    'note-pencil': NotePencil,
    heartbeat: Heartbeat,
    camera: Camera,
    timer: Timer,
    alarm: Alarm,
};

const getIcon = function (type: string) {
    if (!iconComponentMap[type]) {
        throw new Error(`Invalid icon type ${type}`);
    }

    return iconComponentMap[type];
};

export default getIcon;
