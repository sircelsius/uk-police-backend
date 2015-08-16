var express = require('express'),
  router = express.Router(),
  csv = require('fast-csv'),
  fs = require('fs'),
  _ = require('underscore');

var delimiter = '/';

router.param('date', function(req, res, next, date) {
  req.date = date;
  return next();
});

router.get('/:date', function(req, res, next){
  if(!/^\d*-\d*$/.test(req.date)){
    res.json({
      error: "Invalid input format"
    });
    return;
  }
  var arr = [];

  var path = './resources/' + req.date + delimiter + req.date + '-city-of-london-street.csv';

  var stream = fs.createReadStream(path)
    .on('error', function(err){
      res.json({
        error: "Unable to open file"
      });
      return;
    });

  var csvStream = csv
    .parse({
      headers: true
    })
    .on('data', function(data) {

      var month = data.Month ? parseInt(data.Month.substr(5, 6)) : 0;
      var year = data.Month ? parseInt(data.Month.substr(0, 4)) : 0;

      var lat = parseFloat(data.Latitude) ? parseFloat(data.Latitude) : 0;
      var lon = parseFloat(data.Longitude) ? parseFloat(data.Longitude) : 0; 

      var loc = {
        lat: lat,
        lon: lon
      };

      var value = {
        police_id: data['Crime ID'],
        month: month,
        year: year,
        reportedBy: data['Reported by'],
        fallsWithin: data['Falls within'],
        loc: loc,
        location: data['Location'],
        LSOACode: data['LSOA code'],
        LSOAName: data['LSOA name'],
        crimeType: data['Crime type'],
        outcome: data['Last outcome'] 
      }

      arr.push(value);
    })
    .on('end', function() {
      console.log('done');
      res.json(arr);
    })
    .on('error', function(err) {
      console.log("Error: " + err);
      res.json(err);
    });

    stream.pipe(csvStream);
});

module.exports = router;