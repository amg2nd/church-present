// All bookmarks-related publications
import { Meteor } from 'meteor/meteor';
import { Bookmarks } from '../bookmarks.js';

Meteor.publish('bookmarks.all', function () {
  return Bookmarks.find({ userId: this.userId });
});
