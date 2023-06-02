// Tests for the profiles publications
//
// https://guide.meteor.com/testing.html

import { assert } from 'chai';
import { Profiles } from '../profiles.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('profiles publications', function () {
  beforeEach(function () {
    Profiles.remove({});
    Profiles.insert({
      title: 'meteor homepage',
      url: 'https://www.meteor.com',
    });
  });

  describe('profiles.all', function () {
    it('sends all profiles', function (done) {
      const collector = new PublicationCollector();
      collector.collect('profiles.all', (collections) => {
        assert.equal(collections.profiles.length, 1);
        done();
      });
    });
  });
});
