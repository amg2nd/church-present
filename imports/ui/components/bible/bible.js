import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './bible.html';

import { Presentations } from '/imports/api/presentations/presentations.js';
import { SetPageTitle, GetScripture, UpdatePresent, ScrollToVerse, NextVerseIndicator } from '/imports/ui/components/functions.js';

Template.bible.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('presentations.all');
    if (Template.instance().subscriptionsReady()) {
      // Get scripture or scroll to verse
      if(Session.get('getScripture')){
        Session.set('getScripture', false);
        GetScripture();
      }
      if(Session.get('scrollToVerse')){
        Session.set('scrollToVerse', false);
        SetPageTitle();
        UpdatePresent("bible");
        ScrollToVerse();
      }
      // Next verse indicator
      var p = Presentations.findOne({});
      if(p.next != Session.get('nextVerseIndicator')) {
        NextVerseIndicator();
      }
    }
  });
});

Template.bible.onRendered(function() {
  jQuery(".fade").css('display','none');
  jQuery(".fade").fadeIn();
  jQuery('.page-container').click(function() {
    jQuery('.side-menu-button.opened').click();
    jQuery('.button.opened').click();
  });
});  

Template.bible.helpers({
  bible() {
    return Session.get('scripture');
  },
});

Template.bible.events({
  
});
