// All songs-related publications

import { Meteor } from 'meteor/meteor';
import { Songs } from '../songs.js';

Meteor.publish('songs.all', function () {
  return Songs.find({ userId: this.userId });
});
