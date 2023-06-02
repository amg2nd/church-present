import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './nav-bible.html';

import { Books } from '/imports/api/books/books.js';
import { Versions } from '/imports/api/versions/versions.js';
import { Bookmarks } from '/imports/api/bookmarks/bookmarks.js';

import { ScrollToVerse } from '/imports/ui/components/functions.js';

Template.nav_bible.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('books.all');
    self.subscribe('versions.all');
    self.subscribe('bookmarks.all');
    if(Template.instance().subscriptionsReady()) {
      // "Bookmarked" check
      var vQ = FlowRouter.getQueryParam('v') ? '?v='+FlowRouter.getQueryParam('v') : '';
      var url = '/bible/'+FlowRouter.getParam('vId')+'/'+encodeURIComponent(FlowRouter.getParam('bcId'))+vQ;
      var b = Bookmarks.findOne({ url: url });
      if(b){
        jQuery('.bookmark-menu.button').html('<i class="fas fa-bookmark"></i>');
        jQuery('#bookmark').html('');
      } else {
        jQuery('.bookmark-menu.button').html('<i class="far fa-bookmark"></i>');
        jQuery('#bookmark').html('Bookmark This');
      }
    }
  });
});

Template.nav_bible.onRendered(function() {
  
});

Template.nav_bible.helpers({
  books() {
    return Books.find({});
  },
  chapters() {
    var book = Books.findOne({shortCode: Session.get('book')});
    if(book) {
      var cc = book.verseCount.length; // Chapter count
      var ca = []; // Chapter array
      for(i=0;i<cc;i++){
        ca[i] = i+1;
      }
      return ca;
    }
  },
  verseStart() {
    var va = []; // Verse array
    va[0] = '-';
    var book = Books.findOne({shortCode: Session.get('book')});
    if(book) {
      var ci = Session.get('chapter')-1; // Chapter index
      var vc = book.verseCount[ci]; // Verse count
      for(i=1;i<=vc;i++){
        va[i] = i;
      }
    }
    return va;
  },
  verseEnd() {
    var va = []; // Verse array
    va[0] = '-'; 
    vS = parseInt(Session.get('verseStart'));
    if(vS){
      var book = Books.findOne({shortCode: Session.get('book')});
      if(book) {
        var ci = Session.get('chapter')-1; // Chapter index
        var vc = book.verseCount[ci]; // Verse count
        
        //va.length = 0;
        for(i=0;i<=vc-vS;i++){
          va[i+1] = i+vS;
        }
      }
    }
    return va;
  },
  versions() {
    return Versions.find({});
  },
  bookmarks() {
    return Bookmarks.find({});
  },
  bookSelected(option) {
    return Session.get('book') == option.shortCode ? 'selected' : '';
  },
  chapterSelected(option) {
    return Session.get('chapter') == option ? 'selected' : '';
  },
  verseStartSelected(option) {
    return Session.get('verseStart') == option ? 'selected' : '';
  },
  verseEndSelected(option) {
    return Session.get('verseEnd') == option ? 'selected' : '';
  },
  versionSelected(option) {
    return Session.get('version') == option.shortCode ? 'selected' : '';
  },
});

Template.nav_bible.events({
  'change #book'(event, instance) {
    Session.set('book', event.target.value);
    Session.set('chapter', 1);
    Session.set('verseStart', 0);
    Session.set('verseEnd', 0);
    Session.set('verseQuery', 0);
  },
  'change #chapter'(event, instance) {
    var c = event.target.value;
    Session.set('chapter', c != '-' ? c : 1 );
    Session.set('verseStart', 0);
    Session.set('verseEnd', 0);
    Session.set('verseQuery', 0);
  },
  'change #verseStart'(event, instance) {
    var v = event.target.value;
    v = v != '-' ? v : 0;
    Session.set('verseStart', parseInt(v));
    Session.set('verseEnd', 0);
    Session.set('verseQuery', 0);
  },
  'change #verseEnd'(event, instance) {
    var v = event.target.value;
    v = v != '-' ? v : 0;
    Session.set('verseEnd', parseInt(v));
    Session.set('verseQuery', 0);
  },
  'change #version'(event, instance) {
    Session.set('version', event.target.value);
  },
  'click #go'(event, instance) {
    // Get session vars
    var sGvId = Session.get('version');
    var sGb = Session.get('book');
    var sGc = Session.get('chapter');
    var sGvS = Session.get('verseStart');
    var sGvE = Session.get('verseEnd');
    var sGbc = sGb+'.'+sGc;
    var sGvQ = Session.get('verseQuery') ? Session.get('verseQuery') : 0;
    // Get router params
    var vId = FlowRouter.getParam("vId");
    var bcId = decodeURIComponent(FlowRouter.getParam("bcId"));
    var bcIdS = bcId.split(".",2); 
    var cvS,vS = 0,vE = 0,vQ = FlowRouter.getQueryParam("v") ? FlowRouter.getQueryParam("v") : 0;
    if(bcIdS[1]){
      cvS = bcIdS[1].split(":",2);
      if(cvS[1]){
        bcIdS[1] = cvS[0];
        bcId = bcIdS[0]+'.'+bcIdS[1];
        var vseS = cvS[1].split("-",2);
        vS = vseS[0];
        vE = vseS[1];
      }
    }
    if((vId != sGvId) || (bcId != sGbc) || (vE != sGvE)) {
      setTimeout(function () {
        FlowRouter.go('Bible.book');
      },400);
    } else if(vS != sGvS || vQ != sGvQ) {
      FlowRouter.go('Bible.book');
    }
    jQuery('.search-menu').click();
  },
  
  
  
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
  'click .bookmark-menu.wrap a'(event, instance) {
    jQuery('.bookmark-menu.button').click();
    ScrollToVerse();
  },
  'click #bookmark'(event, instance) {
    var url = decodeURI(document.location.pathname);
    var vQ = FlowRouter.getQueryParam('v') ? '?v='+FlowRouter.getQueryParam('v') : '';
    var b = Bookmarks.findOne({ url: url+vQ });
    if(b) {
      alert('Already bookmarked');
    } else {
      Meteor.call('bookmarks.insert', document.title, url+vQ, (error) => {
        if (error) {
          alert(error.error);
        }
      });
    }
  },
  'click .delete'(event, instance) {
    Meteor.call('bookmarks.remove', this._id, (error) => {
      if (error) {
        alert(error.error);
      }
    });
  },
});
