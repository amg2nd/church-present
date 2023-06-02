// Tests for versions methods
// https://guide.meteor.com/testing.html
import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Versions } from './versions.js';
import './methods.js';

if (Meteor.isServer) {
  describe('versions methods', function () {
    beforeEach(function () {
      Versions.remove({});
    });
    it('can add a new version', function () {
      const addVersion = Meteor.server.method_handlers['versions.insert'];
      addVersion.apply({}, ['New King James Version', 'NKJV']);
      assert.equal(Versions.find().count(), 1);
    });
  });
}
