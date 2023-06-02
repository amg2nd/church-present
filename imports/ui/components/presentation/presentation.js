import { Presentations } from '/imports/api/presentations/presentations.js';
import './presentation.html';

import { SetPageTitle, ScrollToVerse, ToggleFullScreen, OnFullScreenExit } from '/imports/ui/components/functions.js';

Template.presentation.onCreated(function () {
  var self = this;
  self.autorun(function() {
    self.subscribe('presentations.all');
    if(Template.instance().subscriptionsReady()) {
      SetPageTitle();
      var p = Presentations.findOne({});
      if(Session.get('page') === undefined){
        Session.set('page', p.page);
        jQuery("#presentationContainer").css('display','none');
      }
      if(p.code !== Session.get('code')) {
        jQuery("#presentationContainer").fadeOut();
        setTimeout(function(){
          Session.set('code', p.code);
          jQuery("html").css('scroll-behavior','auto').scrollTop('').css('scroll-behavior','smooth');
          jQuery("#presentationContainer").fadeIn();
          if(p.code === Session.get('code') && p.page == "bible") {
            setTimeout(function(){
              ScrollToVerse();
            }, 400);
          }
        }, 400);
      } else if(p.page == "bible"){
        if(p.position !== Session.get('position')) {
          Session.set('position', p.position);
          ScrollToVerse();
        }
        var sb = ''; // scroll bible if MSG version
        var ts = p.title.split(" ",4); // book chapter:verse version
        // display chapter only, no verse
        if(ts[3]){ // more than one book, 1 John
          var c = ' '+ts[2].split(":",1)+' '; 
          Session.set('positionText', ts[0]+' '+ts[1]+c+ts[3]);
          if(ts[3] == "MSG"){
            sb = true;
          }
        } else {
          var c = ' '+ts[1].split(":",1)+' ';
          Session.set('positionText', ts[0]+c+ts[2]);
          if(ts[2] == "MSG"){
            sb = true;
          }
        }
        Session.set('scrollBible', sb);
      } else {
        Session.set('positionText', '');
        Session.set('scrollBible', '');
      }
      jQuery('#fullScreen').css('display','none');
      jQuery("html").css('overflow','hidden');
      jQuery("html").css('cursor','none');
      if(Session.get('fullscreen') && Session.get('scrollBible')) {
        jQuery("html").hover(function(){
          jQuery('#fullScreen').css('display','none');
          jQuery("html").css('overflow','');
          jQuery("html").toggleClass('invisible-scrollbar');
          jQuery("html").css('cursor','none');
        },function(){
          jQuery('#fullScreen').css('display','none');
          jQuery("html").css('overflow','hidden');
          jQuery('.invisible-scrollbar').toggleClass('invisible-scrollbar');
          jQuery("html").css('cursor','none');
        });
      } else if(Session.get('fullscreen')) {
        jQuery("html").hover(function(){
          jQuery('#fullScreen').css('display','none');
          jQuery("html").css('overflow','hidden');
          jQuery("html").css('cursor','none');
        });
      } else {
        jQuery("html").hover(function(){
          jQuery('#fullScreen').css('display','');
          jQuery("html").css('overflow','');
          jQuery("html").css('cursor','');
        },function(){
          jQuery('#fullScreen').css('display','none');
          jQuery("html").css('overflow','hidden');
          jQuery("html").css('cursor','none');
        });
      }
    }
  });
  OnFullScreenExit();
});

Template.presentation.helpers({
  code() {
    var p = Presentations.findOne({});
    if(p){
      if(Session.get('code')){
        return Session.get('code');
      } else {
        return p.code;
      }
    }
  },
  position() {
    var p = Presentations.findOne({});
    if(p){
      if(Session.get('positionText')){
        return '<div id="position">'+Session.get('positionText')+'</div>';
      }
    }
  },
});

Template.presentation.events({
  'click #fullScreen': function(event){
    ToggleFullScreen(document.documentElement);
    Session.set('fullscreen', true);
  },
});
