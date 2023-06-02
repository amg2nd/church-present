// Methods related to books
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Books } from './books.js';

Meteor.methods({
  'books.insert'(title, shortCode, verseCount) {
    check(title, String);
    check(shortCode, String);
    check(verseCount, [Number]);
    return Books.insert({
      title,
      shortCode,
      verseCount,
      createdAt: new Date(),
    });
  },
});
