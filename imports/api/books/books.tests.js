// Tests for the behavior of the books collection
// https://guide.meteor.com/testing.html
import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Books } from './books.js';

if (Meteor.isServer) {
  describe('books collection', function () {
    it('insert books correctly', function () {
      const bookId = Books.insert({
        title: 'Jude',
        shortCode: 'Jude',
        verseCount: [25],
      });
      const added = Books.find({ _id: bookId });
      const collectionName = added._getCollectionName();
      const count = added.count();
      assert.equal(collectionName, 'books');
      assert.equal(count, 1);
    });
  });
}
