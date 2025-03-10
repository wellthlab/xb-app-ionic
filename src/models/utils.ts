import Strings from '../utils/string_dict.js';
import * as Realm from 'realm-web';

const isProd = process.env.NODE_ENV === 'production';
const APP_ID = isProd ? 'xb-prod-mpzaf' : 'xb-dev-gwbln';
// const DATABASE = isProd ? 'PRODUCTION' : 'DEVELOPMENT_NEW_SCHEMA';

const hostname = window.location.hostname;
console.debug("Hostname is ", hostname);

var DATABASE : string = "";

switch(hostname.toLowerCase()) {
    case 'xbapp02.ecs.soton.ac.uk':
        DATABASE = 'CONTENTSTAGING';
        break;

    case 'localhost':
        DATABASE = 'DEVELOPMENT_NEW_SCHEMA';
        break;
    case 'xbapp01.ecs.soton.ac.uk':
        DATABASE = 'DEVELOPMENT_NEW_SCHEMA';
        break;
    case 'svm00146.ecs.soton.ac.uk':
    default:
        DATABASE = 'DEMONSTRATION';
        break;

}

console.debug("Mongo database is ", DATABASE);

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

    public static getBuildString() {
        return APP_ID + ' @ ' + DATABASE;
    }

    public static isProd() {
        return isProd;
    }
}

export type ObjectId = Realm.BSON.ObjectId;
