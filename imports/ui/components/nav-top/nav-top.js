import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './nav-top.html';

import { Profiles } from '/imports/api/profiles/profiles.js';
import { UserFiles } from '/imports/api/files/files.js';

import { Presentations } from '/imports/api/presentations/presentations.js';
import { StartPresent, StopPresent } from '/imports/ui/components/functions.js';

import '@fortawesome/fontawesome-free';
import '@fortawesome/fontawesome-free/js/all.js';

Template.nav_top.onCreated(function () {
  var self = this;
  self.autorun(function() {
    self.subscribe('presentations.all');
    self.subscribe('profiles.all');
    self.subscribe('files.all');
    if(Template.instance().subscriptionsReady()) {
      // Go to home page if not logged in
      var routeName = FlowRouter.getRouteName();
      if(routeName != 'Home' && !Meteor.user()){
        FlowRouter.go('Home');
      }
    }
  });
});

Template.nav_top.helpers({
  presentButton() {
    var routeName = FlowRouter.getRouteName();
    if(routeName != 'Stream' && routeName != 'Home' && routeName != 'Admin.base'){
      var p = Presentations.findOne({});
      if(p){
        if((p.page == "worship" && routeName == 'Worship.base')
          || (p.page == "notes" && routeName == 'Notes.base')
          || (p.page == "bible" && routeName == 'Bible.book')
        ){
          return '<div id="stopPresent"><i class="fab fa-chromecast"></i></div>';
        } else {
          var i='',page=p.page;
          if(page == 'worship'){i='<i class="fas fa-music"></i>';}
          if(page == 'notes'){i='<i class="fas fa-sticky-note"></i>';}
          if(page == 'bible'){i='<i class="fas fa-bible"></i>';}
          return '<span id="stopPresent"><span id="presenting">'+i+'</span></span> <span id="startPresent"><i class="fab fa-chromecast"></i></span>';
        }
      }
    }
  },
  listing() {
    var n=FlowRouter.getQueryParam('n');
    if(!n){
      return true;
    }
  },
});

Template.nav_top.events({
  'click .side-menu-button.closed'(event, instance) {
    jQuery('.side-menu-button.closed').toggleClass('opened').toggleClass('closed');
    jQuery('.side-menu-wrap').toggleClass('menu-show');
    jQuery('.button.opened').click();
  },
  'click .side-menu-button.opened'(event, instance) {
    jQuery('.side-menu-button.opened').toggleClass('closed').toggleClass('opened');
    jQuery('.side-menu-wrap.menu-show').toggleClass('menu-show');
  },
  'click #startPresent'(event, instance) {
    var page,routeName = FlowRouter.getRouteName();
    if(routeName == 'Worship.base') {
      page = 'worship';
    }
    if(routeName == 'Notes.base') {
      page = 'notes';
    }
    if(routeName == 'Bible.book') {
      page = 'bible';
    }
    StartPresent(page);
  },
  'click #stopPresent'(event, instance) {
    var cId = 'tcsc'; // presenting church id
    var c = Profiles.findOne({shortCode:cId});
    if(c) {
      var code = "Church Logo";
      if(c.imageId) {
        var img = UserFiles.findOne({_id:c.imageId});
        var src = img._downloadRoute+"/"+img._collectionName+"/"+img._id+"/original/"+img._id+img.extensionWithDot;
        code = '<style>#display{background:url('+src+') no-repeat center center fixed; -webkit-background-size:contain; -moz-background-size:contain; -o-background-size:contain; background-size:contain;}</style>';
      }
      StopPresent(code);
    }
  },
});
