// Tests for the behavior of the notes collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Notes } from './notes.js';

if (Meteor.isServer) {
  describe('notes collection', function () {
    it('insert correctly', function () {
      const bookmarkId = Notes.insert({
        title: 'meteor homepage',
        url: 'https://www.meteor.com',
      });
      const added = Notes.find({ _id: bookmarkId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'notes');
      assert.equal(count, 1);
    });
  });
}
