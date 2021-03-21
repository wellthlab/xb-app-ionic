/**
 * Tests for the XB client
 *
 */
import XBClient from "../client";

var client = new XBClient();

test("login", (done) => {
  client
    .setUser("test@xebre.net", "AJ>#<{Z6`~uPN{ca")
    .then(() => {})
    .then(done);
});

test("getgroups", (done) => {
  client.getGroups().then(console.log).then(done);
});
