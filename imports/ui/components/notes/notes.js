import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './notes.html';

import { Profiles } from '/imports/api/profiles/profiles.js';
import { UserFiles } from '/imports/api/files/files.js';

import { Notes } from '/imports/api/notes/notes.js';
import { SetPageTitle, UpdatePresent, InitTinyMCE } from '/imports/ui/components/functions.js';

import '@fortawesome/fontawesome-free';
import '@fortawesome/fontawesome-free/js/all.js';

Template.notes.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('notes.all');
    if(Template.instance().subscriptionsReady()) {
      InitTinyMCE('.tinymce-title');
      InitTinyMCE('.tinymce-note');
      var n = FlowRouter.getQueryParam('n');
      if(n){
        
      } else { // List view
        var o = Session.get('openNote');
        if(o){
          jQuery('.title.closed.'+o).click();
        }
        
        var cId = 'tcsc'; // presenting church id
        var c = Profiles.findOne({shortCode:cId});
        if(c) {
          var code = "Church Logo";
          if(c.imageId) {
            var img = UserFiles.findOne({_id:c.imageId});
            var src = img._downloadRoute+"/"+img._collectionName+"/"+img._id+"/original/"+img._id+img.extensionWithDot;
            code = '<style>#display{background:url('+src+') no-repeat center center fixed; -webkit-background-size:contain; -moz-background-size:contain; -o-background-size:contain; background-size:contain;}</style>';
          }
          Session.set('notes', code);
        }
        
      }
    }
  });
});

Template.notes.onRendered(function() {
  SetPageTitle();
  jQuery(".fade").css('display','none');
  jQuery(".fade").fadeIn();
  
  setTimeout(function(){
    var n = FlowRouter.getQueryParam('n');
    if(n){
      InitTinyMCE('.tinymce-title');
      InitTinyMCE('.tinymce-note');
      
      jQuery('.mce-i-link').click(function() {
        setTimeout(function(){
          jQuery('.mce-formitem').eq(2).css("display", "none");
          jQuery('.mce-formitem').eq(3).css("display", "none");
          jQuery('.mce-container-body.mce-abs-layout').css("height", "114px");
          jQuery('.mce-foot .mce-container-body.mce-abs-layout').css("height", "50px");
          jQuery('.mce-panel').css("height", "");
        }, 50);
      });
      
    } else { // List view
      jQuery('.title').hover(function(){
        jQuery(this).siblings('.edit, .delete').css('display', 'block');
      }, function(){
        jQuery(this).siblings('.edit, .delete').css('display', 'none');
      });
      jQuery('.edit, .delete').hover(function(){
        jQuery(this).css('display', 'block');
        jQuery(this).siblings('.edit, .delete').css('display', 'block');
      });
    }
  }, 400);
  
  jQuery('.page-container').click(function() {
    jQuery('.side-menu-button.opened').click();
    jQuery('.button.opened').click();
  });
});  

Template.notes.events({
  'click .title.closed'(event, instance) {
    // close open note
    jQuery('.opened').toggleClass('closed').toggleClass('opened');
    jQuery('.slide-toggle').toggleClass('slide-toggle').slideToggle();
    // open target note
    jQuery(event.target).closest('div').toggleClass('closed').toggleClass('opened');
    jQuery(event.target).closest('div').next().toggleClass('slide-toggle').slideToggle();
    
    if(this._id !== undefined) {
      Session.set('openNote', this._id);
    }
  },
  'click .title.opened'(event, instance) {
    // close open note
    jQuery('.opened').toggleClass('closed').toggleClass('opened');
    jQuery('.slide-toggle').toggleClass('slide-toggle').slideToggle();
    
    var o = Session.get('openNote');
    if(o){
      Session.set('openNote', null);
    }
  },
  
  'click .slide'(event, instance) {
    var t=jQuery(event.target);
    if(t.parent('p').length) {t = t.parent('p');}
    if(jQuery(t).hasClass('blue')) {
      jQuery('.slide').removeClass('blue');
      var cId = 'tcsc'; // presenting church id
      var c = Profiles.findOne({shortCode:cId});
      if(c) {
        var code = "Church Logo";
        if(c.imageId) {
          var img = UserFiles.findOne({_id:c.imageId});
          var src = img._downloadRoute+"/"+img._collectionName+"/"+img._id+"/original/"+img._id+img.extensionWithDot;
          code = '<style>#display{background:url('+src+') no-repeat center center fixed; -webkit-background-size:contain; -moz-background-size:contain; -o-background-size:contain; background-size:contain;}</style>';
        }
        Session.set('notes', code);
      }
    } else {
      jQuery('.slide').removeClass('blue');
      jQuery(t).addClass('blue');
      Session.set('notes', t.html().toUpperCase());
    }
    UpdatePresent('notes');
  },
  
  'click .edit'(event, instance) {
    if(this._id !== undefined) {
      FlowRouter.setQueryParams({n: this._id});
      InitTinyMCE('.tinymce-title');
      InitTinyMCE('.tinymce-note');
    }
  },
  'click .delete'(event, instance) {
    var z = confirm('Delete note "'+this.title.replace(/(<([^>]+)>)/gi, "")+'"?');
    if(z) {
      Meteor.call('notes.remove', this._id, (error) => {
        if (error) {
          alert(error.error);
        }
      });
    }
  },
  'click .save'(event, instance) {
    tinymce.triggerSave();
    Meteor.call('notes.update', this._id, jQuery('#edit-title').html(), jQuery('#edit-note').html(), (error) => {
      if (error) {
        alert(error.error);
      } else {
        jQuery('.cancel').click();
      }
    });
  },
  'click .cancel'(event, instance) {
    FlowRouter.withReplaceState(function() {
      FlowRouter.setQueryParams({n: null});
    });
    
    tinymce.remove();
    InitTinyMCE('.tinymce-title');
    InitTinyMCE('.tinymce-note');
    
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

Template.notes.helpers({
  notes() {
    var n=FlowRouter.getQueryParam('n');
    if(n) {
      return Notes.find({_id: n});
    } else {
      return Notes.find({});
    }
  },
  listing() {
    var n=FlowRouter.getQueryParam('n');
    if(!n){
      return true;
    }
  },
});
