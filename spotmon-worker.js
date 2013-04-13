/**
 *
 * SpotMON | Worker Process
 * Copyright 2013 Kyle Hotchkiss
 * Released under the GPL
 *
 */


////////////////////////////////
// Includes and Initalization //
////////////////////////////////
var swig = require('swig');
var async = require('async');
var couchdb = require('couchdb-simple');

var meta = require('./package.json');
var spot = require('./library/spot.js');
var helpers = require('./library/helpers.js');
var position = require('./library/position.js');

var mapbox_key = process.env.MAPBOX_KEY;

swig.init({
	root: 'templates/'
});


///////////////////////
// SpotMON Main Loop //
///////////////////////
var loop = function() {
	database.read("/spotmon/", function( results, error ) {

		if ( typeof error !== "undefined" && error ) {
			///////////////////////////////////////////////
			// CASE: No results || No connection - SLEEP //
			///////////////////////////////////////////////
			sleep();
		} else {
			var queue = async.queue(function( task, callback ) {

				//
				// Action on tracking data.
				//

				var queueId = task.id;
				var queueItem = task.doc;
				var newTracking = false;

				if ( typeof queueItem.tracking === "undefined" ) {
					queueItem.tracking = {};

					newTracking = true;
				}

				spot.getPoints( queueItem.spotid, function( tracking, error ) {
					if ( typeof error !== "undefined" && error ) {
						callback();
					} else {
						var changes = 0;
						var lastPoint;

						for ( var point in tracking ) {
							var exists = false;

							for ( var oldPoint in queueItem.tracking ) {
								if ( typeof queueItem.tracking[ tracking[point].id ] !== "undefined" ) {
									exists = true;
								}
							}

							if ( !exists ) {
								queueItem.tracking[ tracking[point].id ] = tracking[point];

								changes++;

								lastPoint = tracking[point]
							}
						}

						if ( changes ) {
							///////////////////////////////////////////////////////////
							// CASE: Points Added, Notify User Accordingly - FORWARD //
							///////////////////////////////////////////////////////////
							var emailMessage;

							if ( newTracking ) {
								//
								// CASE: Start Monitoring Here.
								//
								console.log("Tracking Init/Ready");
								emailMessage = "Your first point has been caught by SpotMON and your tracking is good to go!";

								// this is a Virginiastar* fnstraj-ctl
							} else {
								if ( changes === 1 ) {
									//
									// Singular Point Update
									//
									console.log("Point Update");
									emailMessage = "Point update: \n " + lastPoint.latitude + ", " + lastPoint.longitude;
								} else {
									//
									// Multiple Point Update
									//
									console.log("Multiple Point Update");
									emailMessage = "Multiple point update: \n " + lastPoint.latitude + ", " + lastPoint.longitude;
								}
							}

							var template = swig.compileFile("emailLayout.htm");

							var email = template.render({
								mapboxkey: mapbox_key,
								message: emailMessage,
								latitude: lastPoint.latitude,
								longitude: lastPoint.longitude
							});

							helpers.sendMail(queueItem.email, "Spot Location Update", email);

							database.write( "/spotmon/" + queueId, queueItem, function() {
								callback();
							});
						} else {
							callback();
						}
					}
				});
			}, 2);

			queue.push( results.rows );

			queue.drain	= function() {
				sleep();
			};
		}
	});
};


///////////////////////
// LOCK-SAFE ADVANCE //
///////////////////////
function advance() {
	setImmediate(function() {
		loop();
	});
}


/////////////////////
// LOCK-SAFE SLEEP //
/////////////////////
function sleep() {
	setImmediate(function() {
		setTimeout(function() {
			loop();
		}, 30000);
	})
}


////////////////////////////////
// INITIALIZE AND RUN SPOTMON //
////////////////////////////////
(function() {
	console.log("\x1B[47;30m SpotMON backend, v." + meta.version + " \x1B[0m");

	advance();
})();