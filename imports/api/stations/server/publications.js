// All stations-related publications
import { Meteor } from 'meteor/meteor';
import { Stations } from '../stations.js';

Meteor.publish('stations.all', function () {
  return Stations.find();
});
