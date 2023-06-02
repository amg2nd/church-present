// All presentations-related publications
import { Meteor } from 'meteor/meteor';
import { Presentations } from '../presentations.js';

Meteor.publish('presentations.all', function () {
  return Presentations.find();
});
