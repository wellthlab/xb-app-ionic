import Strings from '../utils/string_dict.js';
import * as Realm from 'realm-web';

const isProd = process.env.NODE_ENV === 'production';
const APP_ID = isProd ? 'xb-prod-mpzaf' : 'xb-dev-gwbln';
const DATABASE = isProd ? 'PRODUCTION' : 'DEVELOPMENT';

export class BaseModel {
    protected static client = Realm.getApp(APP_ID);

    protected static oid(id?: string) {
        return new Realm.BSON.ObjectId(id);
    }

    protected static getDb() {
        if (!this.client.currentUser) {
            throw new Error(Strings.this_method_should_only_be);
        }

        return this.client.currentUser.mongoClient('mongodb-atlas').db(DATABASE);
    }
}

export type ObjectId = Realm.BSON.ObjectId;
