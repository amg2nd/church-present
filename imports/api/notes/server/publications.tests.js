// Tests for the notes publications
//
// https://guide.meteor.com/testing.html

import { assert } from 'chai';
import { Notes } from '../notes.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('notes publications', function () {
  beforeEach(function () {
    Notes.remove({});
    Notes.insert({
      title: 'Our Pledge',
      note: 'I pledge',
    });
  });

  describe('notes.all', function () {
    it('sends all notes', function (done) {
      const collector = new PublicationCollector();
      collector.collect('notes.all', (collections) => {
        assert.equal(collections.notes.length, 1);
        done();
      });
    });
  });
});
