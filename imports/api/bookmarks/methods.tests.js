// Tests for bookmarks methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Bookmarks } from './bookmarks.js';
import './methods.js';

if (Meteor.isServer) {
  describe('bookmarks methods', function () {
    beforeEach(function () {
      Bookmarks.remove({});
    });

    it('can add a new bookmark', function () {
      const addBookmark = Meteor.server.method_handlers['bookmarks.insert'];

      addBookmark.apply({}, ['meteor.com', 'https://www.meteor.com']);

      assert.equal(Bookmarks.find().count(), 1);
    });
  });
}
