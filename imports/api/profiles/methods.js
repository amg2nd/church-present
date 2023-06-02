// Methods related to profiles
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Profiles } from './profiles.js';

Meteor.methods({
  'profiles.insert'(title, shortCode) {
    check(title, String);
    check(shortCode, String);    
    if (!this.userId) {throw new Meteor.Error('Not authorized.')}
    return Profiles.insert({
      title,
      shortCode,
      createdAt: new Date(),
    });
  },
  'profiles.update'(pId, title, shortCode, imageId) {
    check(title, String);
    check(shortCode, String);
    check(imageId, String);
    return Profiles.update(pId, { $set: {
      title: title,
      shortCode: shortCode,
      imageId: imageId,
    }});
  },
  'profiles.remove'(cId) {
    check(cId, String);
    if (!this.userId) {throw new Meteor.Error('Not authorized.')}
    return Profiles.remove(cId);
  },
});
