// Methods related to playlists
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Playlists } from './playlists.js';

Meteor.methods({
  'playlists.insert'(title, list) {
    check(title, String);
    check(list, String);
    return Playlists.insert({
      title,
      list,
      createdAt: new Date(),
    });
  },
});
