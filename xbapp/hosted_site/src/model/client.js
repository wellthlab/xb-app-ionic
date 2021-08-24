/**
 * Client for interacting with the server component
 * Based on MongoDB realm client
 */
import "abortcontroller-polyfill/dist/polyfill-patch-fetch";
import "babel-polyfill";
import "react-app-polyfill/stable";
// Use the realm WebSDK because we're effectively operating in a web browser
import * as Realm from "realm-web";

var crypto = require("crypto");

function sha512(str) {
  const hash = crypto.createHash("sha512");
  const data = hash.update(str, "utf-8");
  return data.digest("hex");
}

function XBClient() {
  var self = this;

  const APP_ID = "xbframework-yvulh";

  self.realm = new Realm.App({ id: APP_ID, timeout: 10000 });

  console.log("Created realm client", self.realm);

  //TODO add return types for failures
  self.resetPassword = async function (token, tokenId, password) {
    console.log(token, tokenId, password, sha512(password));
    try {
      await self.realm.emailPasswordAuth.resetPassword(
        token,
        tokenId,
        sha512(password)
      );
      return true;
    } catch (err) {
      throw Error(err.message);
    }
  };
}

var xbclient = false;
function getXBClient() {
  if (xbclient === false) {
    xbclient = new XBClient();
  }

  return xbclient;
}

export default getXBClient;
export { XBClient };
