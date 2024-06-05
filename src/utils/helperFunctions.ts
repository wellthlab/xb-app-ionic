import * as Realm from 'realm-web';

export const convertObjectIdFieldsToString = (obj: any) => {
    if (typeof obj !== 'object') {
        return;
    }

    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            if (obj[key] instanceof Realm.BSON.ObjectId) {
                obj[key] = obj[key].toString();
            } else {
                convertObjectIdFieldsToString(obj[key]);
            }
        }
    }
};
