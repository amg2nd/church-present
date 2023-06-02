import './upload.html';

import { Profiles } from '/imports/api/profiles/profiles.js';
import { UserFiles } from '/imports/api/files/files.js';

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.uploadForm.events({
  'change #fileInput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      var file = e.currentTarget.files[0];
      if (file) {
        var uploadInstance = UserFiles.insert({
          file: file,
          chunkSize: 'dynamic',
        }, false);
        var pId = jQuery("#"+e.currentTarget.id).parent().closest('div').attr("id");
        if(pId == "profileImage") {
          var p = Profiles.findOne({shortCode:Session.get('edit')});
          Meteor.call('profiles.update', p._id, p.title, p.shortCode, uploadInstance.config.fileId, (error) => {
            if (error) {
              alert(error.error);
            }
          });
        }
        uploadInstance.on('start', function() {
          template.currentUpload.set(this);
        });
        uploadInstance.on('end', function(error, fileObj) {
          if (error) {
            window.alert('Error during upload: ' + error.reason);
          } else {  
            window.alert('File "' + fileObj.name + '" successfully uploaded');
          }
          template.currentUpload.set(false);
        });
        uploadInstance.start();
      }
    }
  }
});
