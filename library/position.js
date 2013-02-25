/**
 *
 * spotmon | Position Functions
 * Copyright 2013 Kyle Hotchkiss
 * Released under the GPL
 *
 * Taken from fnstraj (http://github.com/kylehotchkiss/fnstraj)
 *
 */

var RADIANS = Math.PI / 180;
var DEGREES = 180 / Math.PI;

exports.distance = function( startLat, startLon, endLat, endLon ) {
	/////////////////////////////////////////////////////////////////
    // Distance between two points, Returns distance in Kilometers //
    /////////////////////////////////////////////////////////////////
    var distanceLat = ( endLat - startLat ) * RADIANS;
    var distanceLon	= ( endLon - startLon ) * RADIANS;
    var lat1 = startLat * RADIANS;
    var lat2 = endLat * RADIANS;

    var step1 = Math.sin(distanceLat/2) * Math.sin(distanceLat/2) + Math.sin(distanceLon/2) * Math.sin(distanceLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var step2 = 2 * Math.atan2(Math.sqrt(step1), Math.sqrt(1-step1));

    return 6378100 * step2;
 };