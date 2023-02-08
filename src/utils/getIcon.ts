import React from 'react';
import {
    ForkKnife,
    Barbell,
    Flask,
    GraduationCap,
    Ruler,
    NotePencil,
    Camera,
    Ear,
    Brain,
    MoonStars,
} from 'phosphor-react';

const iconComponentMap: Record<string, React.ComponentType> = {
    EAT: ForkKnife,
    MOVE: Barbell,
    EXPERIMENT: Flask,
    ADVICE: GraduationCap,
    MEASURE: Ruler,
    QUESTIONNAIRE: NotePencil,
    CAMERA: Camera,
    LISTEN: Ear,
    THINK: Brain,
    SLEEP: MoonStars,
};

const getIcon = function (type: string) {
    if (!iconComponentMap[type]) {
        throw new Error(`Invalid icon type ${type}`);
    }

    return iconComponentMap[type];
};

export default getIcon;
