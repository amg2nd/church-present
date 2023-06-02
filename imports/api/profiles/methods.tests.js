// Tests for profiles methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Profiles } from './profiles.js';
import './methods.js';

if (Meteor.isServer) {
  describe('profiles methods', function () {
    beforeEach(function () {
      Profiles.remove({});
    });

    it('can add a new profile', function () {
      const addProfile = Meteor.server.method_handlers['profiles.insert'];

      addProfile.apply({}, ["The Children's Sanctuary Church", 'tcsc']);

      assert.equal(Profiles.find().count(), 1);
    });
  });
}
