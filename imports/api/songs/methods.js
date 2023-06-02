// Methods related to songs
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Songs } from './songs.js';

Meteor.methods({
  'songs.insert'(title, song) {
    check(title, String);
    check(song, String);
    if (!this.userId) {throw new Meteor.Error('Not authorized.')}
    if (title=="") {throw new Meteor.Error('Blank title.')}
    if (song=="") {throw new Meteor.Error('Blank song.')}
    return Songs.insert({
      title,
      song,
      userId: this.userId,
      createdAt: new Date(),
    });
  },
  'songs.update'(songId, title, song) {
    check(title, String);
    check(song, String);
    if (!this.userId) {throw new Meteor.Error('Not authorized.')}
    return Songs.update(songId, { $set: {
      title: title,
      song: song,
    }});
  },
  'songs.remove'(songId) {
    check(songId, String);
    if (!this.userId) {throw new Meteor.Error('Not authorized.')}
    return Songs.remove(songId);
  },
});
