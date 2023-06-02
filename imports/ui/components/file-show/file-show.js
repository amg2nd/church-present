import './file-show.html';

import { Profiles } from '/imports/api/profiles/profiles.js';
import { UserFiles } from '/imports/api/files/files.js';

Template.showProfileImage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('profiles.all');
    self.subscribe('files.all');
  });
});

Template.showProfileImage.helpers({
  file() {
    var p = Profiles.findOne({shortCode:Session.get('edit')});
    if(p && p.imageId) {
      return UserFiles.findOne({_id:p.imageId});
    }
  },
});

Template.showProfileImage.events({
  'click .delete'(event, instance) {
    var src = jQuery(event.currentTarget).closest('div').find("img").attr("src");
    var file = src ? src.split("original/",2):'';
    var id = file ? file[1].split(".",2):'';
    var img = UserFiles.findOne({_id:id[0]});
    if(img){
      Meteor.call('files.remove', img._id, (error) => {
        if (error) {
          alert(error.error);
        }
      });
    }
    var p = Profiles.findOne({imageId:id[0]});
    if(p) {
      Meteor.call('profiles.update', p._id, p.title, p.shortCode, '', (error) => {
        if (error) {
          alert(error.error);
        }
      });
    }
  },
});

Template.showFiles.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('files.all');
    if (Template.instance().subscriptionsReady()) {
      
    }
  });
});

Template.uploadedFiles.helpers({
  uploadedFiles: function () {
    return UserFiles.find();
  }
});

Template.showFiles.helpers({
  imageFiles() {
    return UserFiles.find();
  },
});

Template.showFiles.events({
  'click .delete'(event, instance) {
    var src = jQuery(event.currentTarget).closest('li').find("img").attr("src");
    var file = src ? src.split("original/",2):'';
    var id = file ? file[1].split(".",2):'';
    var img = UserFiles.findOne({_id:id[0]});
    if(img){
      Meteor.call('files.remove', img._id, (error) => {
        if (error) {
          alert(error.error);
        }
      });
    }
    var p = Profiles.findOne({imageId:id[0]});
    if(p) {
      Meteor.call('profiles.update', p._id, p.title, p.shortCode, '', (error) => {
        if (error) {
          alert(error.error);
        }
      });
    }
  },
});
