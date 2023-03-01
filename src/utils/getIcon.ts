import React from 'react';
import { ForkKnife, Barbell, NotePencil, Camera, Ear, Brain, Moon, Timer } from 'phosphor-react';

const iconComponentMap: Record<string, React.ComponentType> = {
    'fork-knife': ForkKnife,
    barbell: Barbell,
    'note-pencil': NotePencil,
    camera: Camera,
    ear: Ear,
    brain: Brain,
    moon: Moon,
    timer: Timer,
};

const getIcon = function (type: string) {
    if (!iconComponentMap[type]) {
        throw new Error(`Invalid icon type ${type}`);
    }

    return iconComponentMap[type];
};

export default getIcon;
