// Methods related to presentations
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Presentations } from './presentations.js';

Meteor.methods({
  'presentations.insert'(page, title, code, position, next) {
    check(page, String);
    check(title, String);
    check(code, String);
    check(position, String);
    check(next, String);
    return Presentations.insert({
      page,
      title,
      code,
      position,
      next,
      createdAt: new Date(),
    });
  },
  'presentations.update'(pId, page, title, code, position, next) {
    check(page, String);
    check(title, String);
    check(code, String);
    check(position, String);
    check(next, String);
    return Presentations.update(pId, { $set: {
      page: page,
      title: title,
      code: code,
      position: position,
      next: next,
    }});
  },
});
