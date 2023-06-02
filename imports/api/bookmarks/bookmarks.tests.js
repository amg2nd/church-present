// Tests for the behavior of the bookmarks collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Bookmarks } from './bookmarks.js';

if (Meteor.isServer) {
  describe('bookmarks collection', function () {
    it('insert correctly', function () {
      const bookmarkId = Bookmarks.insert({
        title: 'meteor homepage',
        url: 'https://www.meteor.com',
      });
      const added = Bookmarks.find({ _id: bookmarkId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'bookmarks');
      assert.equal(count, 1);
    });
  });
}
