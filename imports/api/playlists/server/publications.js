// All playlists-related publications
import { Meteor } from 'meteor/meteor';
import { Playlists } from '../playlists.js';

Meteor.publish('playlists.all', function () {
  return Playlists.find();
});
