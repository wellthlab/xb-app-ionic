/**
* Client for interacting with the server component
* Based on MongoDB realm client
*/

// Use the realm WebSDK because we're effectively operating in a web browser
import * as Realm from "realm-web";

import { ObjectId } from "bson";

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

    self.realm = new Realm.App({ id: APP_ID, timeout: 10000 });

    console.log("Created realm client", self.realm);

    var checkOpts = function(opts, reqOpts, defOpts) {
        reqOpts.map(function(k) {
            if(typeof opts[k] == 'undefined')
                throw "Required option '"+k+"' is not set";
        });

        Object.keys(defOpts).map(function(k) {
            if(typeof opts[k] == 'undefined')
                opts[k] = defOpts[k];
        });
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

        //console.log("services", self.realm.services);
        //console.log("currentUser", self.realm.currentUser);
        //console.log("currentUser.mongoclient", self.realm.currentUser.mongoClient);

        // In non-web mode
        var svc;
        if(self.realm.currentUser.mongoClient) {
            svc = self.realm.currentUser.mongoClient(ATLAS_APP);
        }
        // In web mode
        else if(self.realm.services) {
            svc = self.realm.services.mongodb(ATLAS_APP);
        }

        var db = svc.db(MONGO_DB);

        return db;
    }

    var string2ID = function(id) {
        return new ObjectId(id);
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

        // Add experiment info
        var exps = await self.getExperiments();
        var getEx = (id) => {
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

        // Add response info
        var responses = await self.getOwnResponses();
        var getRes = (exid) => {
            for(var i in responses) {
                var r = responses[i];
                if(r.experiment == exid) {
                    return r;
                }
            }
            return false;
        }

        for(var i in groups) {
            var g = groups[i];
            g.responses = {};
            var res = getRes(g.experiment.experiment_id);
            g.responses.own = res ? res : {responses: []}
        }

        console.log("User teams", groups);

        return groups;
    }

    function genID(len) {
       var result           = '';
       var characters       = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
       var charactersLength = characters.length;
       for ( var i = 0; i < len; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    /**
     * Create a new team
     */
    self.createTeam = async function(name, desc, expid, start) {

        var db = getDb()

        var collection = db.collection('teams');

        var code = genID(6);

        const team = {
          name: name,
          desc: desc,
          code: code,
          experiment: {
              experiment_id: string2ID(expid),
              start: start
          },
          users: [
              self.realm.currentUser.id
          ]
        };

        try {
            const insertOneResult = await collection.insertOne(team);
        } catch(e) {
            console.log(e);
            return {success: false, message: "Sorry, we couldn't create a new team"};
        }

        return {success: true};
    }

    /**
     * Join the current user to the team identified by the given Team Code
     */
    self.joinTeam = async function(code) {
        try {
            return await self.realm.users[0].functions.joinTeam(code.toUpperCase());
        }
        catch(e) {
            console.log(e);
            return {success: false, message: "Sorry, that code didn't work"};
        }
    }

    /**
     * Add a response for the given team
     */
    self.addResponse = async function(teamid, response) {
        var db = getDb();

        response.added = (new Date()).toISOString();

        var collection = db.collection('responses');

        // This upsert creates the overal response list, if required
        const query = { "team": string2ID(teamid), "user": self.realm.currentUser.id };
        const update = { "$push": { "responses": response } };
        const options = { "upsert": true };

        try {
            var result = await collection.updateOne(query, update, options);
            const { matchedCount, modifiedCount, upsertedId } = result;
        } catch (e) {
            return {success: false, message: e.message};
        }

        return { success: true };
    }

    /**
     * Get responses for the current user
     */
    self.getOwnResponses = async function() {

        var db = getDb();
        var collection = db.collection('teams');

        var responses = await collection.find({"user": self.realm.currentUser.id});

        self.tidy(responses);

        return responses;
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

                if(typeof v == 'undefined' || v == null) continue;

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
