import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './nav-worship.html';

import { Profiles } from '/imports/api/profiles/profiles.js';
import { UserFiles } from '/imports/api/files/files.js';

import { SetPageTitle, UpdatePresent, InitTinyMCE } from '/imports/ui/components/functions.js';

import { Stations } from '/imports/api/stations/stations.js';
import { Playlists } from '/imports/api/playlists/playlists.js';

Template.nav_worship.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('stations.all');
    self.subscribe('playlists.all');
    if(Template.instance().subscriptionsReady()) {
      
    }
  });
});  

Template.nav_worship.onRendered(function() {
  SetPageTitle();
  jQuery('#new-title').blur(function() {
    if(jQuery(this).find('p').html() == "" || jQuery(this).find('p').html() == "<br>" || jQuery(this).find('p').html() == '<br data-mce-bogus="1">') {
      jQuery(this).html('<p>New Song Title</p>');
    }
  });

});

Template.nav_worship.events({
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
    if(jQuery(event.target).html() == "New Song Title") {
      jQuery(event.target).html('');
    }
  },
  'click .save'(event, instance) {
    tinymce.triggerSave();
    Meteor.call('songs.insert', jQuery('#new-title').html(), jQuery('#new-song').html(), (error) => {
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
      jQuery('#new-title').html('New Song Title');
      jQuery('#new-song').html('');
      InitTinyMCE('.tinymce-title');
      InitTinyMCE('.tinymce-song');
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
  
  
  
  'change #playlist'(event, instance) {
    Session.set('playlist', event.target.value);
    Session.set('playlistTitle', event.target[event.target.selectedIndex].text);
  },
  'change #station'(event, instance) {
    Session.set('station', event.target.value);
    Session.set('stationTitle', event.target[event.target.selectedIndex].text);
  },
  'click #goPlaylist'(event, instance) {
    document.title = Session.get('playlistTitle');
    Session.set('worshipPlaylist', '<ol><li class="current">'+Session.get('playlistTitle')+'</li><li>Continue to play YouTube playlist</li></ol>');
    Session.set('worshipPlaylistCurrent', Session.get('playlistTitle'));
    var code = '<iframe width="100%" style="height: calc(100% + 3px);" src="https://www.youtube.com/embed/videoseries?rel=0&controls=0&autoplay=1&list='+Session.get("playlist")+'" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><style>#display{font-size:unset!important;}</style>';
    Session.set('worship', code);
    UpdatePresent('worship');
    setTimeout(function() {
      jQuery('.worship-playlist-wrap').css('margin-top','-'+jQuery('.worship-playlist-wrap').outerHeight()+'px');
    }, 400);
    jQuery('.worship-playlist').click();
  },
  'click #goStation'(event, instance) {
    document.title = Session.get('stationTitle');
    Session.set('worshipPlaylist', '<ol><li class="current">'+Session.get('stationTitle')+'</li><li>Continue to play iHeart Radio station</li></ol>');
    Session.set('worshipPlaylistCurrent', Session.get('stationTitle'));
    var cId = 'tcsc'; // presenting church id
    var c = Profiles.findOne({shortCode:cId});
    if(c) {
      var code = "Church Logo";
      if(c.imageId) {
        var img = UserFiles.findOne({_id:c.imageId});
        var src = img._downloadRoute+"/"+img._collectionName+"/"+img._id+"/original/"+img._id+img.extensionWithDot;
        code = '<img style="height: 70vh;" src="'+src+'" alt="'+img.name+'" />';
      }
      Session.set('worship', code+'<br><iframe allow="autoplay" width="400" height="50" src="'+Session.get("station")+'?embed=true&autoplay=true" frameborder="0"></iframe>');
      UpdatePresent('worship');
    }
    setTimeout(function() {
      jQuery('.worship-playlist-wrap').css('margin-top','-'+jQuery('.worship-playlist-wrap').outerHeight()+'px');
    }, 400);
    jQuery('.worship-playlist').click();
  },
});

Template.nav_worship.helpers({
  listing() {
    var s=FlowRouter.getQueryParam('s');
    if(!s){
      return true;
    }
  },
  playlists() {
    return Playlists.find({});
  },
  stations() {
    return Stations.find({});
  },
  playlistSelected(option) {
    return Session.get('playlist') == option.list ? 'selected' : '';
  },
  stationSelected(option) {
    return Session.get('station') == option.url ? 'selected' : '';
  },
  worshipPlaylist() {
    return Session.get('worshipPlaylist');
  },
  worshipPlaylistCurrent() {
    return Session.get('worshipPlaylistCurrent');
  },
});