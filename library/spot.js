/**
 *
 * spotmon | SPOT API Wrapper
 * Copyright 2013 Kyle Hotchkiss
 * Released under the GPL
 *
 * Function for getting points
 * Function for getting context between points (motion?)
 * Function for data sanity check (is there a pattern? Are we breaking it?)
 *
 */

var https = require("https");

exports.getPoints = function( apikey, callback ) {
	///////////////////////////////////////////////
	// Return a list of points from the SPOT API //
	///////////////////////////////////////////////
	var spotHost = "api.findmespot.com";
	var spotPath = "/spot-main-web/consumer/rest-api/2.0/public/feed/" + apikey + "/message.json";

	var buffer = "";
	var trackedPath = [];

	var couchdb = https.get({
        host: spotHost,
        path: spotPath
    }, function( response ) {
        response.setEncoding('utf8');

	   response.on("data", function( data ) {
            buffer += data;
	   });

	   response.on("end", function() {
            var results = JSON.parse( buffer );

            if ( results.response.errors ) {
                callback( false, true );
            } else {
                var tracking = results.response.feedMessageResponse.messages.message;

                for ( var point in tracking ) {
                    if ( tracking[point].messageType === "TRACK" ) {
                        trackedPath[trackedPath.length] = tracking[point];
                    }
                }

                callback( trackedPath );
            }
        });
	}).on("error", function() {
        callback( false, true );
    });
}

exports.simplify = function( points ) {
    ////////////////////////////////////////////////////////////////
    // Create a simplified point object from SPOT's to save space //
    ////////////////////////////////////////////////////////////////
}