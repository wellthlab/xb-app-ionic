/**
* Client for interacting with the server component
* Based on MongoDB realm client
*/

// Use the realm WebSDK because we're effectively operating in a web browser
import * as Realm from "realm-web";

// GraphQL requires the apollo client; not using atm
//import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

var crypto = require('crypto')

function sha512(str) {
    var hash = crypto.createHash('sha512');
    var data = hash.update(str, 'utf-8');
    return data.digest('hex');
}

/**
* Most methods are async and return promises; so the intended style would be something
* like:
*            client.getExperiments().then(redux.action.setExperiments);
*/
function XBClient() {
    var self = this;

    var APP_ID = "xbframework-yvulh";
    var ATLAS_APP = "mongodb-atlas";
    var MONGO_DB = "V2";
    var graphql_url = `https://realm.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`;

    self.realm = new Realm.App({ id: APP_ID, timeout: 10000 });


    // Get a configured GraphQL client
    var _db = false;
    var getDb = function() {

        if(_db !== false) {
            return _db;
        }

        if(!self.realm.currentUser.accessToken) {
            throw "Cannot use DB until autenticated with realm";
        }

        console.log("services", self.realm.services);
        console.log("currentUser", self.realm.currentUser);
        console.log("currentUser.mongoclient", self.realm.currentUser.mongoClient);

        // In non-web mode
        if(self.realm.currentUser.mongoClient) {
            var svc = self.realm.currentUser.mongoClient(ATLAS_APP);
        }
        // In web mode
        else if(self.realm.services) {
            var svc = self.realm.services.mongodb(ATLAS_APP);
        }

        var db = svc.db(MONGO_DB);

        return db;
    }

    self.register = async function(email, password, data) {
        await self.realm.emailPasswordAuth.registerUser( email, sha512(password) );
        return await self.setUser(email, password);
    }


    // Log in and set the realm user
    self.setUser = async function(email, password) {
        var cpw = await sha512(password);
        //console.log("Hash", cpw);
        const credentials = Realm.Credentials.emailPassword(email, cpw);
        try {
            const user = await self.realm.logIn(credentials);
            return user;
        } catch(err) {
            throw Error(err.message);
        }
    }

    /**
    * Get all groups for the current user
    */
    self.getTeams = async function() {
        var db = getDb();

        var collection = db.collection('teams');

        var groups = await collection.find({"users": {
            "$elemMatch": {
                "$eq": self.realm.currentUser.id
            }
        }});

        self.tidy(groups);

        var exps = await self.getExperiments();
        var getEx = (id) => {
            console.log("Look for experiment", id, "in", exps);
            for(var i in exps) {
                var e = exps[i];
                if(e._id == id){
                    return e;
                }
            }
            return false;
        }

        for(var i in groups) {
            var g = groups[i];
            g.experiment.info = getEx(g.experiment.experiment_id);
        }



        console.log("User teams", groups);

        return groups;
    }

    /**
     * Get details of an experiment
     */
    self.getExperiments = async function(exid) {
        var db = getDb();

        var collection = db.collection('experiments');

        var exps = await collection.find({ });

        return self.tidy(exps);
    }

    /**
     * Tidy up a result so it's safe to pass into redux with warnings about non-serializabilty
     *
     */
    self.tidy = function(result, depth) {

        if(typeof depth == 'undefined') {
            depth = 0;
        }

        if(depth == 0) {
            //console.log("Tidy", result);
        }

        if(Array.isArray(result)) {
            for(var i in result) {
                result[i] = self.tidy(result[i], depth+1);
            }
        }
        else if(typeof result == 'object') {
            for(var k of Object.keys(result)) {
                var v = result[k];

                if(typeof v == 'undefined') continue;

                if(v.id && v.id instanceof Uint8Array) { // Picks up mongo object IDs
                    result[k] = v.toString();
                }
                else {
                    result[k] = self.tidy(result[k], depth+1);
                }
            }
        }

        return result;
    }


}

var xbclient = false;
function getXBClient() {
    if(xbclient === false) {
        xbclient = new XBClient();
    }

    return xbclient;
}

export default getXBClient;
export { XBClient };
