// Tests for the behavior of the playlists collection
// https://guide.meteor.com/testing.html
import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Playlists } from './playlists.js';

if (Meteor.isServer) {
  describe('playlists collection', function () {
    it('insert playlists correctly', function () {
      const playlistId = Playlists.insert({
        title: 'Worship - Sunday',
        list: 'PLvP7cLneIyNJAt7mKmyG5Vfsmm9b-g_4w',
      });
      const added = Playlists.find({ _id: playlistId });
      const collectionName = added._getCollectionName();
      const count = added.count();
      assert.equal(collectionName, 'playlists');
      assert.equal(count, 1);
    });
  });
}
