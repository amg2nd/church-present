// Methods related to bookmarks
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Bookmarks } from './bookmarks.js';

Meteor.methods({
  'bookmarks.insert'(title, url) {
    check(title, String);
    check(url, String);
    if (!this.userId) {throw new Meteor.Error('Not authorized.')}
    return Bookmarks.insert({
      title,
      url,
      userId: this.userId,
      createdAt: new Date(),
    });
  },
  'bookmarks.remove'(bookmarkId) {
    check(bookmarkId, String);
    if (!this.userId) {throw new Meteor.Error('Not authorized.')}
    return Bookmarks.remove(bookmarkId);
  },
});
