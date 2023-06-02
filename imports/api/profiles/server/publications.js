// All profiles-related publications

import { Meteor } from 'meteor/meteor';
import { Profiles } from '../profiles.js';

Meteor.publish('profiles.all', function () {
  return Profiles.find();
});
