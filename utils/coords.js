'use strict';

exports.getCoordsWithinRadius = (center, radius) => {
  /*
  Latitude and Longitude of the center are in decimal degrees
  Radius is in meters and has to be converted to decimal degrees
  Earth's circumference measured around the equator is 40075017 m
  The equator is divided into 360 degrees of longitude
  Each degree at the equator represents approximately (40075017 m) / 360 = 111320 m
  Reference: https://en.wikipedia.org/wiki/Decimal_degrees
  */
  const radiusInDeg = (radius / 111320);

  /*
  The radius is multiplied by a square root to have a more uniform distribution
  Reference: https://mathworld.wolfram.com/DiskPointPicking.html
  */
  const r = radiusInDeg * Math.sqrt(Math.random());
  const t = 2 * Math.PI * Math.random();

  /*
  The [lat, lng] pair represepnts a point at some distance r away from center towards an angle t
  Longitude is divided by cos(center.lat) (where center.lat is in radians)
  because distance between degrees of longitude varies depending on the location
  1 degree is equivalent to π/180 radians
  */
  const lat = r * Math.sin(t);
  const lng = (r * Math.cos(t)) / Math.cos(center.lat * Math.PI / 180);

  return { lat: +(center.lat + lat).toFixed(6), lng: +(center.lng + lng).toFixed(6) };
};
