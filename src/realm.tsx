import * as Realm from 'realm-web';

export const APP_ID = process.env.NODE_ENV === 'production' ? 'xb-prod-mpzaf' : 'xb-dev-gwbln';
export const DB = process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT';

export const realmApp = new Realm.App({ id: APP_ID });

export function getDb() {
    return realmApp.currentUser?.mongoClient('mongodb-atlas').db(DB);
}

export function oid(id: string) {
    return new Realm.BSON.ObjectId(id);
}

export function isRealmError(error: unknown): error is Realm.MongoDBRealmError {
    return error instanceof Realm.MongoDBRealmError;
}

export function isRealmErrorStatusCode(error: unknown, statusCode: number) {
    return isRealmError(error) && error.statusCode === statusCode;
}

export function isRealmErrorCode(error: unknown, errorCode: string) {
    return isRealmError(error) && error.errorCode === errorCode;
}
