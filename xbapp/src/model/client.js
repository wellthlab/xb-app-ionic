/**
* Client for interacting with the server component
* Based on MongoDB realm client
*/

// Use the realm WebSDK because we're effectively operating in a web browser
import * as Realm from "realm-web";

// GraphQL requires the apollo client
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";


/**
* Most methods are async and return promises; so the intended style would be something
* like:
*            client.getExperiments().then(redux.action.setExperiments);
*/
function XBClient() {
    var self = this;

    var APP_ID = "xbframework-yvulh";
    var ATLAS_APP = "mongodb-atlas";
    var MONGO_DB = "V1";
    var graphql_url = `https://realm.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`;

    self.realm = new Realm.App({ id: APP_ID });


    // Log in and set the realm user
    self.setUser = async function(email, password) {
        const credentials = Realm.Credentials.emailPassword(email, password);
        try {
            const user = await app.logIn(credentials);
            return user;
        } catch(err) {
            console.error("Failed to log in", err);
        }
    }

    // Get a configured GraphQL client
    var _db = false;
    var getDb = function() {

        if(_db !== false) {
            return _db;
        }

        if(!self.realm.currentUser.accessToken) {
            throw "Cannot use DB until autenticated with realm";
        }

        return self.realm.mongodb(ATLAS_APP).db(MONGO_DB);
    }

    /**
    * Get all groups for the current user
    */
    self.getGroups = async function() {
        var db = self.getDb();

        var collection = db.getCollection('groups');

        var groups = collection.find({"users": {
            "$elemMatch": {
                "$eq": self.realm.currentUser.id
            }
        }});

        return self.convert();
    }

    /**
     * Get details of a specific experiment
     */
    self.getExperiment = async function(exid) {

    }

}



export default XBClient;
