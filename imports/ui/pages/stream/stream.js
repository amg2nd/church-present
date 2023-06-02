import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './stream.html';

import { Profiles } from '/imports/api/profiles/profiles.js';
import { UserFiles } from '/imports/api/files/files.js';

import { SetPageTitle, StartPresent, StopPresent } from '/imports/ui/components/functions.js';

Template.page_stream.onCreated(function() {
  var self = this;
  self.autorun(function() {
    if(Template.instance().subscriptionsReady()) {
      
    }
  });
});

Template.page_stream.onRendered(function() {
  SetPageTitle();
});  

Template.page_stream.events({
  'click #startStream'(event, instance) {
    var z = confirm("Show Start Message?");
    if(z) {
      var cId = 'tcsc'; // presenting church id
      var c = Profiles.findOne({shortCode:cId});
      if(c) {
        var code = "Church Logo";
        if(c.imageId) {
          var img = UserFiles.findOne({_id:c.imageId});
          var src = img._downloadRoute+"/"+img._collectionName+"/"+img._id+"/original/"+img._id+img.extensionWithDot;
          code = '<img style="height: 70vh;" src="'+src+'" alt="'+img.name+'" />';
        }
        Session.set('stream', code+'<br>Welcome Online Viewers!');
        StartPresent('stream');
        setTimeout(function(){
          code = '<style>#display{background:url('+src+') no-repeat center center fixed; -webkit-background-size:contain; -moz-background-size:contain; -o-background-size:contain; background-size:contain;}</style>';
          StopPresent(code);
        }, 5000);
      }
    }
  },
  'click #stopStream'(event, instance) {
    var z = confirm("Show Stop Message?");
    if(z) {
      var cId = 'tcsc'; // presenting church id
      var c = Profiles.findOne({shortCode:cId});
      if(c) {
        var code = "Church Logo";
        if(c.imageId) {
          var img = UserFiles.findOne({_id:c.imageId});
          var src = img._downloadRoute+"/"+img._collectionName+"/"+img._id+"/original/"+img._id+img.extensionWithDot;
          code = '<img style="height: 70vh;" src="'+src+'" alt="'+img.name+'" />';
        }
        Session.set('stream', code+'<br>Have a Blessed Day!');
        StartPresent('stream');
        setTimeout(function(){
          code = '<style>#display{background:url('+src+') no-repeat center center fixed; -webkit-background-size:contain; -moz-background-size:contain; -o-background-size:contain; background-size:contain;}</style>';
          StopPresent(code);
        }, 5000);
      }
    }
  },
});

Template.page_stream.helpers({
  
});