// Tests for the behavior of the profiles collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Profiles } from './profiles.js';

if (Meteor.isServer) {
  describe('profiles collection', function () {
    it('insert correctly', function () {
      const profileId = Profiles.insert({
        title: "The Children's Sanctuary Church",
        shortCode: 'tcsc',
      });
      const added = Profiles.find({ _id: profileId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'profiles');
      assert.equal(count, 1);
    });
  });
}
