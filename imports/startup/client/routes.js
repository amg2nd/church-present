import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Import templates
import '../../ui/components/file-show/file-show.js';
import '../../ui/components/nav-side/nav-side.js';
import '../../ui/components/nav-top/nav-top.js';
import '../../ui/components/upload/upload.js';
import '../../ui/layouts/404/404.js';
import '../../ui/layouts/main/main.js';
import '../../ui/layouts/present/present.js';
import '../../ui/pages/admin/admin.js';
import '../../ui/pages/bible/bible.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/notes/notes.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/present/present.js';
import '../../ui/pages/stream/stream.js';
import '../../ui/pages/worship/worship.js';

// Set up all routes in the app

// Home page
FlowRouter.route('/', {
  name: 'Home',
  action() {
    document.title = 'Church Present';
    BlazeLayout.render('layout_main', { top: "nav_top",  side: "nav_side", main: "page_home" });
  },
});
// Admin pages
var adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'Admin',
});

adminRoutes.route('/', {
  name: 'Admin.base',
  action() {
    BlazeLayout.render('layout_main', { top: "nav_top", side: "nav_side", main: "page_admin" });
  },
});
// Worship pages
var worshipRoutes = FlowRouter.group({
  prefix: '/worship',
  name: 'Worship',
});

worshipRoutes.route('/', {
  name: 'Worship.base',
  action() {
    Session.setDefault('playlist', 'PLvP7cLneIyNJAt7mKmyG5Vfsmm9b-g_4w');
    Session.setDefault('playlistTitle', 'Worship - Sunday');
    Session.setDefault('station', 'https://www.iheart.com/live/hallelujah-7005/');
    Session.setDefault('stationTitle', 'Hallelujah - Gospel & Inspirational Music');
    Session.setDefault('worship', 'Worship');
    Session.setDefault('worshipPlaylist', '"Worship"');
    Session.setDefault('worshipPlaylistCurrent', 'Worship');
    BlazeLayout.render('layout_main', { top: "nav_top", side: "nav_side", main: "page_worship" });
  },
});
// Notes pages
var notesRoutes = FlowRouter.group({
  prefix: '/notes',
  name: 'Notes',
});

notesRoutes.route('/', {
  name: 'Notes.base',
  action() {
    Session.setDefault('notes', 'Notes');
    BlazeLayout.render('layout_main', { top: "nav_top", side: "nav_side", main: "page_notes" });
  },
});
// Bible pages
var bibleRoutes = FlowRouter.group({
  prefix: '/bible',
  name: 'Bible',
});

bibleRoutes.route('/', {
  name: 'Bible.base',
  action() {
    // Set default scripture 
    Session.setDefault('version', 'NKJV');
    Session.setDefault('book', 'Gen');
    Session.setDefault('chapter', '1');
    Session.setDefault('verseStart', 0);
    Session.setDefault('verseEnd', 0);
    Session.setDefault('verseQuery', 0);
    // Get session vars
    var sGvId = Session.get('version');
    var sGb = Session.get('book');
    var sGc = Session.get('chapter');
    var sGvS = Session.get('verseStart');
    var sGvE = Session.get('verseEnd');
    var vS = '',vE = '';
    if(sGvE){
      vS = sGvS ? ':'+sGvS : '';
      vE = sGvE ? '-'+sGvE : '';
    }
    var sGbc = sGb+'.'+sGc;
    var sGvQ = !sGvE ? sGvS : Session.get('verseQuery');
    var vQ = sGvQ ? {v: sGvQ} : {};
    setTimeout(function(){
      FlowRouter.withReplaceState(function() {
        FlowRouter.go('Bible.book', {vId: sGvId, bcId: sGbc+vS+vE}, vQ);
      });
    });
  },
});

bibleRoutes.route('/:vId', {
  name: 'Bible.version',
  action(params) {
    Session.set('version', params.vId.toUpperCase());
    FlowRouter.go('Bible.book');
  },
});

bibleRoutes.route('/:vId/:bcId', {
  name: 'Bible.book',
  action(params, queryParams) {
    // Get router params
    var vId = params.vId.toUpperCase();
    var bcId = decodeURIComponent(params.bcId);
    var bcIdS = bcId.split(".",2);
    var cvS,vS = 0,vE = 0,vQ = queryParams.v ? queryParams.v : 0;
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
    
    
    // ** Need to change "previous bible route" session variable to "current (viewing) bookmark" database entry **
    
    
    // Check for previous 'Bible.book' route
    var pR = Session.get('prevRoute');
    if(pR) {
      // Get previous route params
      var pRvId = pR.params.vId;
      var pRbcId = decodeURIComponent(pR.params.bcId);
      var pRbcIdS = pRbcId.split(".",2);
      var pRcvS,pRvS = 0,pRvE = 0,pRvQ = pR.queryParams.v ? pR.queryParams.v : 0;
      if(pRbcIdS[1]){
        pRcvS = pRbcIdS[1].split(":",2);
        if(pRcvS[1]){
          pRbcIdS[1] = pRcvS[0];
          pRbcId = pRbcIdS[0]+'.'+pRbcIdS[1];
          var pRvseS = pRcvS[1].split("-",2);
          pRvS = pRvseS[0];
          pRvE = pRvseS[1];
        }
      }
      // Scroll to verse or get scripture
      if(pRvId == vId && pRbcId == bcId && pRvS == vS && pRvE == vE) {
        Session.set('scrollToVerse', true);
      } else if(pRvId == vId && pRbcId == bcId && !pRvE && !vE) {
        Session.set('scrollToVerse', true);
      } else {
        Session.set('getScripture', true);
      }
    } else {
      Session.set('getScripture', true);
    }
    
    if(Session.get('getScripture') || Session.get('scrollToVerse')) {
      // Check if chapter in URL
      if(bcIdS[1]){
        // Set session vars
        Session.set('version', vId);
        Session.set('book', bcIdS[0]);
        Session.set('chapter', bcIdS[1]);
        if (vQ && !vS) {vS=vQ}
        Session.set('verseStart', vS);
        Session.set('verseEnd', vE);
        Session.set('verseQuery', vQ);
        // Render layout
        BlazeLayout.render('layout_main', { top: "nav_top", side: "nav_side", main: "page_bible" });
      } else {
        FlowRouter.go('Bible.book', {vId: vId, bcId: bcId+'.1'});
      }
    }
  },
  triggersExit: [function(context, redirect) {
    // Set previous 'Bible.book' router params
    Session.set('prevRoute', { params: context.params, queryParams: context.queryParams });
  }],
});
// Stream page
FlowRouter.route('/stream', {
  name: 'Stream',
  action() {
    BlazeLayout.render('layout_main', { top: "nav_top", side: "nav_side", main: "page_stream" });
  },
});

// Present pages
FlowRouter.route('/:cId', {
  name: 'Presentation',
  action(params, queryParams) {
    document.title = 'Presentation';
    BlazeLayout.render('layout_present', 'page_present');
  },
});
// 404 page
FlowRouter.route('*', {
  name: 'Not Found',
  action() {
    document.title = '404 - Page Not Found';
    this.render('layout_404', 'page_notFound');
  },
});
