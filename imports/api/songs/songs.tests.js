// Tests for the behavior of the songs collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Songs } from './songs.js';

if (Meteor.isServer) {
  describe('songs collection', function () {
    it('insert correctly', function () {
      const bookmarkId = Songs.insert({
        title: 'meteor homepage',
        url: 'https://www.meteor.com',
      });
      const added = Songs.find({ _id: bookmarkId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'songs');
      assert.equal(count, 1);
    });
  });
}
