// Tests for the books publications
// https://guide.meteor.com/testing.html
import { assert } from 'chai';
import { Books } from '../books.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('books publications', function () {
  beforeEach(function () {
    Books.remove({});
    Books.insert({
      title: 'Jude',
      shortCode: 'Jude',
      verseCount: [25],
    });
  });
  describe('books.all', function () {
    it('sends all books', function (done) {
      const collector = new PublicationCollector();
      collector.collect('books.all', (collections) => {
        assert.equal(collections.books.length, 1);
        done();
      });
    });
  });
});
