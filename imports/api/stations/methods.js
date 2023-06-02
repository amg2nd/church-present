// Methods related to stations
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Stations } from './stations.js';

Meteor.methods({
  'stations.insert'(title, url) {
    check(title, String);
    check(url, String);
    return Stations.insert({
      title,
      url,
      createdAt: new Date(),
    });
  },
});
