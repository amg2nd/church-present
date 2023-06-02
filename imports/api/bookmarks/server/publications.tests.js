// Tests for the bookmarks publications
//
// https://guide.meteor.com/testing.html

import { assert } from 'chai';
import { Bookmarks } from '../bookmarks.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('bookmarks publications', function () {
  beforeEach(function () {
    Bookmarks.remove({});
    Bookmarks.insert({
      title: 'meteor homepage',
      url: 'https://www.meteor.com',
    });
  });

  describe('bookmarks.all', function () {
    it('sends all bookmarks', function (done) {
      const collector = new PublicationCollector();
      collector.collect('bookmarks.all', (collections) => {
        assert.equal(collections.bookmarks.length, 1);
        done();
      });
    });
  });
});
