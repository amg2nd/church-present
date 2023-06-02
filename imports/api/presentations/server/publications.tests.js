// Tests for the presentations publications
// https://guide.meteor.com/testing.html
import { assert } from 'chai';
import { Presentations } from '../presentations.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('presentations publications', function () {
  beforeEach(function () {
    Presentations.remove({});
    Presentations.insert({
      page: '',
      title: 'Presentation Page',
      code: '<div>Presentation Page</div>',
      position: '',
      next: '',
    });
  });
  describe('presentations.all', function () {
    it('sends all presentations', function (done) {
      const collector = new PublicationCollector();
      collector.collect('presentations.all', (collections) => {
        assert.equal(collections.presentations.length, 1);
        done();
      });
    });
  });
});
