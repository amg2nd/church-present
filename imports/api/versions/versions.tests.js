// Tests for the behavior of the versions collection
// https://guide.meteor.com/testing.html
import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Versions } from './versions.js';

if (Meteor.isServer) {
  describe('versions collection', function () {
    it('insert versions correctly', function () {
      const versionId = Versions.insert({
        title: 'New King James Version',
        shortCode: 'NKJV',
      });
      const added = Versions.find({ _id: versionId });
      const collectionName = added._getCollectionName();
      const count = added.count();
      assert.equal(collectionName, 'versions');
      assert.equal(count, 1);
    });
  });
}
