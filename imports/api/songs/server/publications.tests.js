// Tests for the songs publications
//
// https://guide.meteor.com/testing.html

import { assert } from 'chai';
import { Songs } from '../songs.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('songs publications', function () {
  beforeEach(function () {
    Songs.remove({});
    Songs.insert({
      title: 'Song Title',
      note: 'Lyrics',
    });
  });

  describe('songs.all', function () {
    it('sends all songs', function (done) {
      const collector = new PublicationCollector();
      collector.collect('songs.all', (collections) => {
        assert.equal(collections.songs.length, 1);
        done();
      });
    });
  });
});
