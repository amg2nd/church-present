// Tests for the behavior of the presentations collection
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Presentations } from './presentations.js';

if (Meteor.isServer) {
  describe('presentations collection', function () {
    it('insert presentations correctly', function () {
      const presentationId = Presentations.insert({
        page: '',
        title: 'Presentation Page',
        code: '<div>Presentation Page</div>',
        position: '',
        next: '',
      });
      const added = Presentations.find({ _id: presentationId });
      const collectionName = added._getCollectionName();
      const count = added.count();
      assert.equal(collectionName, 'presentations');
      assert.equal(count, 1);
    });
  });
}
