// Tests for the versions publications
// https://guide.meteor.com/testing.html
import { assert } from 'chai';
import { Versions } from '../versions.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('versions publications', function () {
  beforeEach(function () {
    Versions.remove({});
    Versions.insert({
      title: 'New King James Version',
      shortCode: 'NKJV',
    });
  });
  describe('versions.all', function () {
    it('sends all versions', function (done) {
      const collector = new PublicationCollector();
      collector.collect('versions.all', (collections) => {
        assert.equal(collections.versions.length, 1);
        done();
      });
    });
  });
});
