import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './worship.html';

import { Profiles } from '/imports/api/profiles/profiles.js';
import { UserFiles } from '/imports/api/files/files.js';

import { Songs } from '/imports/api/songs/songs.js';
import { SetPageTitle, UpdatePresent, InitTinyMCE } from '/imports/ui/components/functions.js';

Template.worship.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('songs.all');
    if (Template.instance().subscriptionsReady()) {
      InitTinyMCE('.tinymce-title');
      InitTinyMCE('.tinymce-song');
      var s = FlowRouter.getQueryParam('s');
      if(s){
        
      } else { // List view
        var o = Session.get('openSong');
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
          Session.set('worship', code);
        }
        
      }
    }
  });
});

Template.worship.onRendered(function() {
  jQuery(".fade").css('display','none');
  jQuery(".fade").fadeIn();
  
  setTimeout(function(){
    var s = FlowRouter.getQueryParam('s');
    if(s){
      InitTinyMCE('.tinymce-title');
      InitTinyMCE('.tinymce-song');
      
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

Template.worship.events({
  'click .title.closed'(event, instance) {
    // close open song
    jQuery('.opened').toggleClass('closed').toggleClass('opened');
    jQuery('.slide-toggle').toggleClass('slide-toggle').slideToggle();
    // open target song
    jQuery(event.target).closest('div').toggleClass('closed').toggleClass('opened');
    jQuery(event.target).closest('div').next().toggleClass('slide-toggle').slideToggle();
    
    if(this._id !== undefined) {
      Session.set('openSong', this._id);
    }
  },
  'click .title.opened'(event, instance) {
    // close open song
    jQuery('.opened').toggleClass('closed').toggleClass('opened');
    jQuery('.slide-toggle').toggleClass('slide-toggle').slideToggle();
    
    var o = Session.get('openSong');
    if(o){
      Session.set('openSong', null);
    }
  },
  
  'click .slide'(event, instance) {
    var t=jQuery(event.target);
    if(t.parent('p').length) {t = t.parent('p');}
    if(jQuery(t).hasClass('blue')) {
      /*
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
        Session.set('worship', code);
      }
      */
    } else {
      jQuery('.slide').removeClass('blue');
      jQuery(t).addClass('blue');
      Session.set('worship', t.html().toUpperCase());
    }
    UpdatePresent('worship');
  },
  
  'click .edit'(event, instance) {
    if(this._id !== undefined) {
      FlowRouter.setQueryParams({s: this._id});
      InitTinyMCE('.tinymce-title');
      InitTinyMCE('.tinymce-song');
    }
  },
  'click .delete'(event, instance) {
    var z = confirm('Delete song "'+this.title.replace(/(<([^>]+)>)/gi, "")+'"?');
    if(z) {
      Meteor.call('songs.remove', this._id, (error) => {
        if (error) {
          alert(error.error);
        }
      });
    }
  },
  'click .save'(event, instance) {
    tinymce.triggerSave();
    Meteor.call('songs.update', this._id, jQuery('#edit-title').html(), jQuery('#edit-song').html(), (error) => {
      if (error) {
        alert(error.error);
      } else {
        jQuery('.cancel').click();
      }
    });
  },
  'click .cancel'(event, instance) {
    FlowRouter.withReplaceState(function() {
      FlowRouter.setQueryParams({s: null});
    });
    
    tinymce.remove();
    InitTinyMCE('.tinymce-title');
    InitTinyMCE('.tinymce-song');
    
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

Template.worship.helpers({
  songs() {
    var s=FlowRouter.getQueryParam('s');
    if(s) {
      return Songs.find({_id: s});
    } else {
      return Songs.find({});
    }
  },
  listing() {
    var s=FlowRouter.getQueryParam('s');
    if(!s){
      return true;
    }
  },
});
