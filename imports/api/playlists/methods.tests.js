// Tests for playlists methods
// https://guide.meteor.com/testing.html
import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Playlists } from './playlists.js';
import './methods.js';

if (Meteor.isServer) {
  describe('playlists methods', function () {
    beforeEach(function () {
      Playlists.remove({});
    });
    it('can add a new playlist', function () {
      const addPlaylist = Meteor.server.method_handlers['playlists.insert'];
      addPlaylist.apply({}, ['Worship - Sunday', 'PLvP7cLneIyNJAt7mKmyG5Vfsmm9b-g_4w']);
      assert.equal(Playlists.find().count(), 1);
    });
  });
}
