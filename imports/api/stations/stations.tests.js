// Tests for the behavior of the stations collection
// https://guide.meteor.com/testing.html
import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Stations } from './stations.js';

if (Meteor.isServer) {
  describe('stations collection', function () {
    it('insert stations correctly', function () {
      const stationId = Stations.insert({
        title: 'K-LOVE - Positive, Encouraging K-LOVE',
        url: 'https://www.iheart.com/live/k-love-5162/?embed=true&autoplay=true',
      });
      const added = Stations.find({ _id: stationId });
      const collectionName = added._getCollectionName();
      const count = added.count();
      assert.equal(collectionName, 'stations');
      assert.equal(count, 1);
    });
  });
}
