// Tests for the playlists publications
// https://guide.meteor.com/testing.html
import { assert } from 'chai';
import { Playlists } from '../playlists.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('playlists publications', function () {
  beforeEach(function () {
    Playlists.remove({});
    Playlists.insert({
      title: 'Worship - Sunday',
      list: 'PLvP7cLneIyNJAt7mKmyG5Vfsmm9b-g_4w',
    });
  });
  describe('playlists.all', function () {
    it('sends all playlists', function (done) {
      const collector = new PublicationCollector();
      collector.collect('playlists.all', (collections) => {
        assert.equal(collections.playlists.length, 1);
        done();
      });
    });
  });
});
