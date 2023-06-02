import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './nav-notes.html';

import { InitTinyMCE } from '/imports/ui/components/functions.js';

Template.nav_notes.onCreated(function() {
  var self = this;
  self.autorun(function() {
    if(Template.instance().subscriptionsReady()) {
      
    }
  });
});

Template.nav_notes.onRendered(function() {
  jQuery('#new-title').blur(function() {
    if(jQuery(this).find('p').html() == "" || jQuery(this).find('p').html() == "<br>" || jQuery(this).find('p').html() == '<br data-mce-bogus="1">') {
      jQuery(this).html('<p>New Note Title</p>');
    }
  });
});

Template.nav_notes.helpers({
  listing() {
    var n=FlowRouter.getQueryParam('n');
    if(!n){
      return true;
    }
  },
});

Template.nav_notes.events({
  'click .button.closed'(event, instance) {
    // close side menu
    jQuery('.side-menu-button.opened').click();
    // close other menus
    jQuery('.button.opened').click();
    // open target menu
    jQuery(event.target).closest('div').toggleClass('opened').toggleClass('closed');
    jQuery(event.target).closest('div').next().slideToggle();
  },
  'click .button.opened'(event, instance) {
    // close current menu
    jQuery(event.target).closest('div').toggleClass('closed').toggleClass('opened');
    jQuery(event.target).closest('div').next().slideToggle();
  },
  'click #new-title p'(event, instance) {
    if(jQuery(event.target).html() == "New Note Title") {
      jQuery(event.target).html('');
    }
  },
  'click .save'(event, instance) {
    tinymce.triggerSave();
    Meteor.call('notes.insert', jQuery('#new-title').html(), jQuery('#new-note').html(), (error) => {
      if (error) {
        alert(error.error);
      } else {
        jQuery('.cancel').click();
      }
    });
  },
  'click .cancel'(event, instance) {
    jQuery('.button.opened').click();
    setTimeout(function(){
      tinymce.remove();
      jQuery('#new-title').html('New Note Title');
      jQuery('#new-note').html('');
      InitTinyMCE('.tinymce-title');
      InitTinyMCE('.tinymce-note');
    }, 400);
    jQuery('.title').hover(function(){
      jQuery(this).siblings('.edit, .delete').css('display', 'block');
    }, function(){
      jQuery(this).siblings('.edit, .delete').css('display', 'none');
    });
    jQuery('.edit, .delete').hover(function(){
      jQuery(this).css('display', 'block');
      jQuery(this).siblings('.edit, .delete').css('display', 'block');
    });
  },
});
