// Tests for songs methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Songs } from './songs.js';
import './methods.js';

if (Meteor.isServer) {
  describe('songs methods', function () {
    beforeEach(function () {
      Songs.remove({});
    });

    it('can add a new song', function () {
      const addSong = Meteor.server.method_handlers['songs.insert'];

      addSong.apply({}, ['Song Title', 'Lyrics']);

      assert.equal(Songs.find().count(), 1);
    });
  });
}
