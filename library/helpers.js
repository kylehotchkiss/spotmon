/**
 *
 * spotmon | Helpers
 * Copyright 2013 Kyle Hotchkiss
 * Released under the GPL
 *
 * Taken from fnstraj (http://github.com/kylehotchkiss/fnstraj)
 *
 */

var swig = require("swig");
var https = require("https");
var querystring = require('querystring');

var mailgun_key	= process.env.MAILGUN_KEY;
var mailgun_url	= process.env.MAILGUN_URL;
var mailgun_from = process.env.MAILGUN_FROM;


/////////////////////////////////
// Email Wrapper (via Mailgun) //
/////////////////////////////////
exports.sendMail = function( to, subject, body, callback ) {
    var status = "";

    var message = querystring.stringify({
        from: mailgun_from,
        to: to,
        subject: subject,
        html: body
    });

    var mailgun = https.request({
        auth: "api" + ":key-" + mailgun_key,
        host: "api.mailgun.net",
        path: "/v2/" + mailgun_url + "/messages",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': message.length
        },
        method: "POST"
    }, function() {
        if ( typeof callback !== "undefined" ) {
            callback();
        }
    }).on('error', function() {
        if ( typeof callback !== "undefined" ) {
            callback( true );
        }
    });

    mailgun.write( message );
    mailgun.end();
}