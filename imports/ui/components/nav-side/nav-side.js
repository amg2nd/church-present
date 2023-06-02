import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './nav-side.html';

Template.nav_side.onCreated(function () {
  var self = this;
  self.autorun(function() {
    if(Template.instance().subscriptionsReady()) {
      
    }
  });
});

Template._loginButtonsLoggedOutDropdown.onRendered(function () {
  var m = jQuery('.login-link-text').outerWidth()+70;
  jQuery('.side-menu-wrap').css('margin-left','-'+m+'px');
});
Template._loginButtonsLoggedInDropdown.onRendered(function () {
  var m = jQuery('.login-link-text').outerWidth()+70;
  jQuery('.side-menu-wrap').css('margin-left','-'+m+'px');
});
Template._loginButtonsLoggedOutAllServices.onRendered(function () {
  jQuery('.login-close-text').html('<i class="fas fa-times"></i>');
});
Template._loginButtonsLoggedInDropdownActions.onRendered(function () {
  jQuery('.login-close-text').html('<i class="fas fa-times"></i>');
  jQuery('#sideNavContainer').append('<div class="modal-overlay"></div>');
  jQuery('#__blaze-root').append('<div class="modal-overlay"></div>');
});
Template._loginButtonsLoggedInDropdownActions.onDestroyed(function () {
  jQuery('.modal-overlay').remove();
});

Template.nav_side.helpers({
  
});

Template.nav_side.events({
  'click #home'(event, instance) {
    if(FlowRouter.getRouteName() != 'Home') {
      jQuery(".fade").fadeOut();
      jQuery('.side-menu-button.opened').click();
      setTimeout(function () {
        FlowRouter.go('/');
      },400);
    }
  },
  'click #worship'(event, instance) {
    if(FlowRouter.getRouteName() != 'Worship.base') {
      jQuery(".fade").fadeOut();
      jQuery('.side-menu-button.opened').click();
      setTimeout(function () {
        FlowRouter.go('/worship');
      },400);
    }
  },
  'click #notes'(event, instance) {
    if(FlowRouter.getRouteName() != 'Notes.base') {
      jQuery(".fade").fadeOut();
      jQuery('.side-menu-button.opened').click();
      setTimeout(function () {
        FlowRouter.go('/notes');
      },400);
    }
  },
  'click #bible'(event, instance) {
    if(FlowRouter.getRouteName() != 'Bible.book') {
      jQuery(".fade").fadeOut();
      jQuery('.side-menu-button.opened').click();
      setTimeout(function () {
        FlowRouter.go('/bible');
      },400);
    }
  },
  'click #stream'(event, instance) {
    if(FlowRouter.getRouteName() != 'Stream') {
      jQuery(".fade").fadeOut();
      jQuery('.side-menu-button.opened').click();
      setTimeout(function () {
        FlowRouter.go('/stream');
      },400);
    }
  },
  'click #admin'(event, instance) {
    if(FlowRouter.getRouteName() != 'Admin.base') {
      jQuery(".fade").fadeOut();
      jQuery('.side-menu-button.opened').click();
      setTimeout(function () {
        FlowRouter.go('/admin');
      },400);
    }
  },
  'click .fa-user'(event, instance) {
    jQuery('.login-link-text').click();
  },
  'click .login-link-text'(event, instance) {
    jQuery('.side-menu-button.opened').click();
  },
});
