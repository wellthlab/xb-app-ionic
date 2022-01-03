/**
 * Format a timestamp as a nice date string
 *
 */

var dateFormat = require("dateformat");

export default function (ts) {
  // Recent dates
  var date = new Date(ts);

  return dateFormat(date, "ddd d mmm yyyy");
}
