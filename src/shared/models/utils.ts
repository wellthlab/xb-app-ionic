import * as Realm from 'realm-web';

export class BaseModel {
    protected static client = Realm.getApp('xbframework-yvulh');

    protected static oid(id?: string) {
        return new Realm.BSON.ObjectId(id);
    }

    protected static getDb() {
        if (!this.client.currentUser) {
            throw new Error('This method should only be called when user is authenticated');
        }

        return this.client.currentUser.mongoClient('mongodb-atlas').db('AUGUST22');
    }
}

export const idToTs = function (id: string) {
    return new Realm.BSON.ObjectId(id).getTimestamp().getTime();
};

export type ObjectId = Realm.BSON.ObjectId;
