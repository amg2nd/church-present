// Methods related to versions
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Versions } from './versions.js';

Meteor.methods({
  'versions.insert'(title, shortCode) {
    check(title, String);
    check(shortCode, String);
    return Versions.insert({
      title,
      shortCode,
      createdAt: new Date(),
    });
  },
});
