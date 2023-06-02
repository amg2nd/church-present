// Methods related to notes
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Notes } from './notes.js';

Meteor.methods({
  'notes.insert'(title, note) {
    check(title, String);
    check(note, String);
    if (!this.userId) {throw new Meteor.Error('Not authorized.')}
    if (title=="") {throw new Meteor.Error('Blank title.')}
    if (note=="") {throw new Meteor.Error('Blank note.')}
    return Notes.insert({
      title,
      note,
      userId: this.userId,
      createdAt: new Date(),
    });
  },
  'notes.update'(noteId, title, note) {
    check(title, String);
    check(note, String);
    if (!this.userId) {throw new Meteor.Error('Not authorized.')}
    return Notes.update(noteId, { $set: {
      title: title,
      note: note,
    }});
  },
  'notes.remove'(noteId) {
    check(noteId, String);
    if (!this.userId) {throw new Meteor.Error('Not authorized.')}
    return Notes.remove(noteId);
  },
});
