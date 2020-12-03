/**
 * Controllers link the client up with the redux model
 * for common operations
 *
 * use the addControllersProp() to wrap components that need to call controllers,
 * it adds the available controllers as a prop
 */

import React, { useContext } from 'react';

import {CLEAR_TEAMS, SET_TEAMS} from './slices/Teams'
import {CLEAR_EXPERIMENTS, SET_EXPERIMENTS} from './slices/Experiments'

/**
 * These controller functions will be returned by getControllers
 * - they'll be wrapped so that client and store are provided
 */

function LOAD_TEAMS(client, store) {
    // Clear the current teams and set the fetching flag
    store.dispatch(CLEAR_TEAMS());
    // Get the teams and pop them into the store
    client.getTeams().then(
        (teams) => {
            store.dispatch(SET_TEAMS( { teams } ));
        }, (err) => {
            console.error(err);
        }
    );
}

async function JOIN_TEAM(client, store, code) {
    // Try to join a team using the given code
    // This is implemented as a trigger in the Realm server
    var res = await client.users[1].functions.joinTeam(code);

    console.log("JOINED TEAM", res);

}

function LOAD_EXPERIMENTS(client, store) {
    store.dispatch(CLEAR_EXPERIMENTS());
    client.getExperiments().then(
        (exps) => {
            store.dispatch(SET_EXPERIMENTS( { exps } ));
        }, (err) => {
            console.error(err);
        }
    );

}


function getControllers(store, client) {

    var out = {client: client, store: store};

    var controllers = { LOAD_TEAMS, LOAD_EXPERIMENTS, JOIN_TEAM };

    for(var n of Object.keys(controllers)) {
        var f = controllers[n];
        out[n] =    (function(f,n) { return function(...args) { // Trap f and n in a closure so they don't change
                        console.log("Call controller", n, f, args);
                        return f(client, store, ...args);
                    }})(f,n);
    }

    return out;
}

/**
 * A Higher ORder Component that provides a controllers prop contianing
 * the controllers from the curent context
 */
function addControllersProp(Component) {
    return function(props) {
        var controllers = useContext(ControllerContext);
        return <Component controllers={controllers} {...props} />
    }
}

const ControllerContext = React.createContext(
    false
);

export default ControllerContext;
export { getControllers, addControllersProp };
