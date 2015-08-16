'use strict';

var mongoose = require('mongoose');

var PoliceRecordSchema = new mongoose.Schema({
  crimeId: String,
  year: Number,
  month: Number,
  reportedBy: String,
  fallsWithin: String,
  loc: {
    name: String,
    lat: Number,
    lon: Number
  },
  lsoaCode: String,
  lsaoName: String,
  crimeType: String,
  lastOutcome: String,
  context: String
});

mongoose.model('policeRecord', PoliceRecordSchema);