// All files-related publications
import { Meteor } from 'meteor/meteor';
import { UserFiles } from './s3.js';

Meteor.publish('files.all', function () {
  return UserFiles.find().cursor;
});
