// Methods related to roles
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
  updateRoles: function (targetUserId, roles, scope) {
    check(targetUserId, String);
    check(roles, [String]);
    check(scope, String);

    var loggedInUser = Meteor.user();

    if (!loggedInUser ||
        !Roles.userIsInRole(loggedInUser, 
                            ['admin'], scope)) {
      throw new Meteor.Error('access-denied', "Access denied");
    }

    Roles.setUserRoles(targetUserId, roles, scope);
  },
  revokeUser: function (targetUserId, scope) {
    check(targetUserId, String);
    check(scope, String);
  
    var loggedInUser = Meteor.user();

    if (!loggedInUser ||
        !Roles.userIsInRole(loggedInUser, 
                            ['admin'], scope)) {
      throw new Meteor.Error('access-denied', "Access denied")
    }

    // remove roles for target scope
    Roles.setUserRoles(targetUserId, [], scope)
  },
});
