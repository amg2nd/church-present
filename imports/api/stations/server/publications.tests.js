// Tests for the stations publications
// https://guide.meteor.com/testing.html
import { assert } from 'chai';
import { Stations } from '../stations.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('stations publications', function () {
  beforeEach(function () {
    Stations.remove({});
    Stations.insert({
      title: 'K-LOVE - Positive, Encouraging K-LOVE',
      url: 'https://www.iheart.com/live/k-love-5162/?embed=true&autoplay=true',
    });
  });
  describe('stations.all', function () {
    it('sends all stations', function (done) {
      const collector = new PublicationCollector();
      collector.collect('stations.all', (collections) => {
        assert.equal(collections.stations.length, 1);
        done();
      });
    });
  });
});
