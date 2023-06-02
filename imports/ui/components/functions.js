import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { Presentations } from '/imports/api/presentations/presentations.js';
import { Bookmarks } from '/imports/api/bookmarks/bookmarks.js';
import { Books } from '/imports/api/books/books.js';
import { Versions } from '/imports/api/versions/versions.js';

// Set page title
export const SetPageTitle = function() {
  var routeName = FlowRouter.getRouteName();
  // Home
  if(routeName == 'Home') {
    jQuery("#favicon").attr("href","/img/church-solid.svg");
    jQuery("#sideNavContainer div").css('color','');
    document.title = 'Welcome to Church Present';
    setTimeout(function(){
      jQuery("#sideNavContainer #home").css('color','blue');
    }, 400);
  }
  //Notes
  if(routeName == 'Notes.base') {
    jQuery("#favicon").attr("href","/img/sticky-note-solid.svg");
    jQuery("#sideNavContainer div").css('color','');
    document.title = 'Notes';
    setTimeout(function(){
      jQuery("#sideNavContainer #notes").css('color','blue');
    }, 400);
  }
  // Worship
  if(routeName == 'Worship.base') {
    jQuery("#favicon").attr("href","/img/music-solid.svg");
    jQuery("#sideNavContainer div").css('color','');
    document.title = Session.get('worshipPlaylistCurrent');
    setTimeout(function(){
      jQuery("#sideNavContainer #worship").css('color','blue');
    }, 400);
  }
  // Bible
  if(routeName == 'Bible.book') {
    jQuery("#favicon").attr("href","/img/bible-solid.svg");
    jQuery("#sideNavContainer div").css('color','');
    var version = Versions.findOne({shortCode: Session.get('version')});
    var vsc = version ? ' '+version.shortCode : '';
    var book = Books.findOne({shortCode: Session.get('book')});
    var bt = book ? book.title : 'Bible';
    var c = Session.get('chapter') ? ' '+Session.get('chapter') : '';
    var vS = Session.get('verseStart') ? ':'+Session.get('verseStart') : '';
    var vE = Session.get('verseEnd') ? '-'+Session.get('verseEnd') : '';
    document.title = bt+c+vS+vE+vsc;
    setTimeout(function(){
      jQuery("#sideNavContainer #bible").css('color','blue');
    }, 400);
  }
  // Stream
  if(routeName == 'Stream') {
    jQuery("#favicon").attr("href","/img/broadcast-tower-solid.svg");
    jQuery("#sideNavContainer div").css('color','');
    document.title = 'Stream Message';
    setTimeout(function(){
      jQuery("#sideNavContainer #stream").css('color','blue');
    }, 400);
  }
  // Admin
  if(routeName == 'Admin.base') {
    jQuery("#favicon").attr("href","/img/cog-solid.svg");
    jQuery("#sideNavContainer div").css('color','');
    document.title = 'Admin Settings';
    setTimeout(function(){
      jQuery("#sideNavContainer #admin").css('color','blue');
    }, 400);
  }
  // Presentation
  if(routeName == 'Presentation') {
    var p = Presentations.findOne({});
    document.title = "Present: "+p.title;
  }
  // All pages except presentation and bible
  if(routeName != 'Presentation' && routeName != 'Bible.book') {
    jQuery(".fade").css('display','none');
    jQuery(".fade").fadeIn();
    jQuery('.page-container').click(function() {
      jQuery('.side-menu-button.button-open').toggleClass('button-open');
      jQuery('.side-menu-wrap.menu-show').toggleClass('menu-show');
    });
  }
}
// TinyMCE WYSIWYG editor
export const InitTinyMCE = function(s) {
  var toolbar,inline,content_style,style_formats=[];
  
  if(s == '.tinymce-title') {
    toolbar = 'undo redo';
    inline = true;
  } else if(s == '.tinymce-note') {
    toolbar = 'undo redo | styleselect | bold italic | link'; // | scripture
    content_style = 'p {margin: 5px 0;} ' +
    '.slide {border: 1px solid #000; padding: 5px;}';
    style_formats.push(
      {title: 'Slide Text', block: 'p', classes: 'slide'},
      {title: 'Slide Title', selector: '.slide', inline: 'span', styles: { 'font-size': '1.5em', } },
      {title: 'Slide Subtitle', selector: '.slide', inline: 'span', styles: { 'font-size': '0.8em', } },
    );
  } else if(s == '.tinymce-song') {
    toolbar = 'undo redo | styleselect | bold italic';
    content_style = 'p {margin: 5px 0;} ' +
    '.slide {border: 1px solid #000; padding: 5px;}';
    style_formats.push(
      {title: 'Slide Text', block: 'p', classes: 'slide'},
      {title: 'Slide Title', selector: '.slide', inline: 'span', styles: { 'font-size': '1.5em', } },
      {title: 'Slide Subtitle', selector: '.slide', inline: 'span', styles: { 'font-size': '0.8em', } },
    );
  }
  
  tinymce.init({
    selector: s,
    skin_url: '/packages/teamon_tinymce/skins/lightgray',
    menubar: false,
    browser_spellcheck: true,
    preview_styles: false,
    plugins: 'paste link',
    paste_auto_cleanup_on_paste : true,
    toolbar: toolbar,
    inline: inline,
    content_style: content_style,
    style_formats: style_formats,
    /*
    setup: (editor) => {
      editor.addButton('scripture', {
        text: 'Scripture',
        onclick: () => editor.windowManager.open({title: 'Insert Scripture', url: '/bible',})
      })
    },
    */
  });
}
// Cross domain 'cors-anywhere' fork
jQuery.ajaxPrefilter(function(options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = 'https://church-present-cors.herokuapp.com/' + options.url;
  }
});
// Get scripture from biblegateway.com
export const GetScripture = function() {
  jQuery(".page-container").css('display','none');
  // console.log('Loading...');
  Session.set('scripture', 'Loading...');
  jQuery(".page-container").fadeIn();
  SetPageTitle();
  setTimeout(function(){
    jQuery.get("https://www.biblegateway.com/passage/?search="+FlowRouter.getParam('bcId')+"&version="+FlowRouter.getParam('vId'), function (response) {
      var bibleText = jQuery(response).find(".passage-text").html();
      jQuery(".page-container").fadeOut();
      setTimeout(function(){
        if(bibleText){
          Session.set('scripture', bibleText);
          setTimeout(function(){
            FormatScripture();
            Session.set('scripture', jQuery('#bibleContainer').html());
          });
          setTimeout(function(){
            UpdatePresent("bible");
            jQuery(".page-container").fadeIn();
            setTimeout(function(){
              ScrollToVerse();
            }, 400);
            // console.log('Done');
          }, 20);
        } else {
          var noText = 'There is no scripture to display.';
          Session.set('scripture', noText);
          jQuery(".page-container").fadeIn();
          // console.log(noText);
        }
      },400);
    }).fail(function() {
      var failedText = 'Failed to get scripture';
      Session.set('scripture', failedText);
      console.log(failedText);
    });
  },400);
}
// Format scripture
export const FormatScripture = function() {
  // Remove footnotes and labels
  jQuery(".footnote, .footnotes, .crossreference, .crossrefs, span.chapternum, .full-chap-link, .passage-other-trans").remove();
}
// Update presentation
export const UpdatePresent = function(page) {
  var p = Presentations.findOne({});
  if(p.page == page){StartPresent(page);}
}
// Start presentation
export const StartPresent = function(page) {
  var page,title,code,p = Presentations.findOne({});
  if(p) {
    if(page == "stream") {
      page = 'stream';
      title = document.title;
      code = Session.get('stream');
    }
    if(page == "worship") {
      page = 'worship';
      title = document.title;
      code = Session.get('worship');
    }
    if(page == "notes") {
      page = 'notes';
      title = document.title;
      code = Session.get('notes');
    }
    if(page == "bible") {
      var v = Session.get('verseQuery') ? Session.get('verseQuery') : Session.get('verseStart');
      var position = '.'+Session.get('book')+'-'+Session.get('chapter')+'-'+v;
      page = 'bible';
      title = document.title;
      code = Session.get('scripture');
      if(p.position != position){
        p.position = position;
      }
    }
    Meteor.call('presentations.update', p._id, page, title, code, p.position, p.next, (error) => {
      if (error) {
        alert(error.error);
      }
    });
  }
}
// Stop presentation
export const StopPresent = function(code) {
  var page = '',title,position = '',next = '',p = Presentations.findOne({});
  if(p) {
    title = 'Church Present';
    if(!code) { code = 'Church Present'; }
    Meteor.call('presentations.update', p._id, page, title, code, position, next, (error) => {
      if (error) {
        alert(error.error);
      }
    });
  }
}
// Toggle fullscreen
export const ToggleFullScreen = function(elem) {
  if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
    if(elem.requestFullScreen) {
      elem.requestFullScreen();
    } else if(elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if(elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if(elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    Session.set('fullscreen', true);
    ScrollToVerse();
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if(document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if(document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if(document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}
// On fullscreen exit
export const OnFullScreenExit = function() {
  document.addEventListener('fullscreenchange', exitHandler, false);
  document.addEventListener('mozfullscreenchange', exitHandler, false);
  document.addEventListener('webkitfullscreenchange', exitHandler, false);
  document.addEventListener('MSFullscreenChange', exitHandler, false);
  
  function exitHandler() {
   if (!document.fullscreenElement && !document.mozFullScreen && !document.webkitIsFullScreen && !document.msFullscreenElement) {
     Session.set('fullscreen', false);
   }
  }
}
// Scroll to verse
export const ScrollToVerse = function() {
  var p = Presentations.findOne({});
  if(p) {
    var bcv,bc,v,className,routeName = FlowRouter.getRouteName();
    // Verse class check
    if(routeName == 'Presentation') {
      var ps = p.position.split(".",2);
      bcv = ps[1].split("-",6); // Book, Chapter, Verse array (6 for MSG version)
      bc = bcv[0]+'-'+bcv[1]+'-';
      v = bcv[5] ? parseInt(bcv[5]) : parseInt(bcv[2]);
    } else {
      bc = Session.get('book')+'-'+Session.get('chapter')+'-';
      v = parseInt(Session.get('verseQuery') ? Session.get('verseQuery') : Session.get('verseStart'));
    }
    // If no verse selected, start with first verse
    v = v!=0 ? v : 1;
    // If no match, check if MSG version
    var vC = jQuery("."+bc+v);
    if(!vC.length){
      var i=0;
      do {
        vC = jQuery("span[class*='"+bc+(v-i)+"']:first"); // Verse check
        if(vC.length){
          var cLA = vC.attr('class').split(/\s+/); // Class list array
          className = '.'+cLA[1]; // cLA[0] = 'text'
        } else {
          i++;
        }
      }
      while(!vC.length && i<10); // Limit loop to 10
    }
    // Update className
    if(!className){className = '.'+bc+v;}
    // topNavContainer offset
    var tNC = 0;
    if(routeName != 'Presentation') {
      tNC = jQuery("#topNavContainer").outerHeight()+1;
    }
    // Scroll
    if(className){
      var scrollTo = '';
      if(jQuery(className).length) {
        var vOt = Math.round(jQuery(className).offset().top); // Verse offset top
        scrollTo = vOt-tNC;
      }
      jQuery("html").scrollTop(scrollTo);
      // Call next verse functions if presenting
      if(p.page == "bible") {
        if(routeName == 'Presentation') {
          NextVersePresent(className);
        } else {
          NextVerseIndicator();
        }
      }
    }
  }
}
// Scroll to verse on window width resize
var rTime;
var timeOut = false;
var delta = 200;
var wW = jQuery(window).width();
jQuery(window).resize(function() {
  rTime = new Date();
  if (timeOut === false) {
    timeOut = true;
    setTimeout(resizeEnd, delta);
  }
});
function resizeEnd() {
  if (new Date() - rTime < delta) {
    setTimeout(resizeEnd, delta);
  } else {
    timeOut = false;
    if(jQuery(window).width() != wW){
      wW = jQuery(window).width();
      ScrollToVerse();
    }
  }               
}
// Next verse to present
function NextVersePresent(className) {
  var p = Presentations.findOne({});
  if(p) {
    var next,vOt,bcv,bc,v,nV;
    p.position=className // Override p.position (for MSG version)
    var wH = jQuery(window).height()-jQuery('#bottomContainer').height();
    if(jQuery(p.position).length) {
      vOt = Math.round(jQuery(p.position).offset().top); // Current verse offset top
      var ps = p.position.split(".",2);
      bcv = ps[1].split("-",6); // Book, Chapter, Verse array (6 for MSG version)
      bc = bcv[0]+'-'+bcv[1]+'-';
      v = bcv[5] ? parseInt(bcv[5]) : parseInt(bcv[2]);
      nV = jQuery("span[class*='"+bc+(v+1)+"']:first"); // Next verse check
    }
    if(nV) {
      if(nV.length) {
        var nVC,lCB,i=1;
        do {
          nVC = jQuery("span[class*='"+bc+(v+i)+"']:first");
          if(nVC.length){
            var nVA = nVC.attr('class').split(/\s+/); // Next verse class array
            var lC = jQuery("."+nVA[1]+":last"); // Last class instance
            lCB = Math.round(jQuery(lC).offset().top)+jQuery(lC).outerHeight(); // last class bottom
            if(lCB>vOt+wH) {
              if(p.next != '.'+nVA[1]) { //nVA[0] = 'text'
                next = '.'+nVA[1];
              }
            }
            bcv = nVA[1].split("-",6);
            if(bcv[5]){ // Verse check
              i=(parseInt(bcv[5])+1)-v;
            } else {
              i++;
            }
          } else {
            next = '';
          }
        }
        while(nVC.length && lCB<vOt+wH);
      } else {
        next = '';
      }
    }
    if(next !== undefined) {
      if(p.next != next) {
        p.next = next;
      }
      
      // *Multiple present windows*
      
      //var n = next.split("-",3);
      //var pn = p.next.split("-",3);
      //var pp = p.position.split("-",3);
      //var nN = n[2] ? parseInt(n[2]) : 0; // calculated next verse number
      //var pnN = pn[2] ? parseInt(pn[2]) : 0; // stored next verse number
      //var ppN = pp[2] ? parseInt(pp[2]) : 0; // stored position
      
      //if(pnN == 0 || (pnN > nN && nN != 0) || pnN == ppN) {
        Meteor.call('presentations.update', p._id, p.page, p.title, p.code, p.position, p.next, (error) => {
          if (error) {
            alert('Error: '+error.error);
          }
        });
      //}
      
      // Last verse test
      //if(next == '') {console.log('last verse viewable');} else {console.log(next);}
    }
  }
}
// Next verse indicator
export const NextVerseIndicator = function() {
  // Reset indicators
  Session.set('nextVerseIndicator', '');
  jQuery('span').css('border','').css('cursor','').unbind('click');
  jQuery('sup').css('color','');
  // Highlight next verse
  var p = Presentations.findOne({});
  if(p && p.next){
    Session.set('nextVerseIndicator', p.next);
    var ns = p.next.split(".",2);
    var bcv = ns[1].split("-",6); // Book, Chapter, Verse array (6 for MSG version)
    var bc = bcv[0]+'-'+bcv[1]+'-';
    var v = bcv[5] ? parseInt(bcv[5]) : parseInt(bcv[2]);
    var next = 'p '+p.next;
    jQuery(next+':first').css('border-bottom','1px solid #000').css('cursor','pointer');
    jQuery(next+' sup').css('color','blue');
    jQuery(next+':first').click(function() {
      if(Session.get('verseEnd')){
        Session.set('verseQuery', parseInt(v));
      } else {
        Session.set('verseStart', parseInt(v));
      }
      FlowRouter.go('Bible.book');
    });
  }
}
