import './admin.html';

import { Profiles } from '/imports/api/profiles/profiles.js';
import { SetPageTitle } from '/imports/ui/components/functions.js';

Template.page_admin.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('profiles.all');
    if (Template.instance().subscriptionsReady()) {
      
    }
  });
});

Template.page_admin.onRendered(function() {
  SetPageTitle();
}); 

Template.page_admin.helpers({
  profiles() {
    return Profiles.find();
  },
  hasProfileImage() {
    var p = Profiles.findOne({shortCode:Session.get('edit')});
    if(p && p.imageId) {
      return true;
    }
  },
  edit() {
    return Session.get('edit');
  },
});

Template.page_admin.events({
  'click #cancel'(event, instance) {
    Session.set('edit', false);
  },
  'click #edit'(event, instance) {
    var c = jQuery('#profile').val();
    Session.set('edit', c);
  },
  'click #save'(event, instance) {
    Session.set('edit', false);
  },
});
