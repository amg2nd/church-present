// All versions-related publications
import { Meteor } from 'meteor/meteor';
import { Versions } from '../versions.js';

Meteor.publish('versions.all', function () {
  return Versions.find();
});
