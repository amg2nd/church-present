import './home.html';

import { Profiles } from '/imports/api/profiles/profiles.js';
import { UserFiles } from '/imports/api/files/files.js';

import { SetPageTitle } from '/imports/ui/components/functions.js';

Template.page_home.onCreated(function() {
  // counter starts at 0
  // this.counter = new ReactiveVar(0);
});

Template.page_home.onRendered(function() {
  SetPageTitle();
}); 

Template.page_home.helpers({
  logo() {
    var cId = 'tcsc'; // presenting church id
    var c = Profiles.findOne({shortCode:cId});
    if(c) {
      var code = "Church Logo";
      if(c.imageId) {
        var img = UserFiles.findOne({_id:c.imageId});
        var src = img._downloadRoute+"/"+img._collectionName+"/"+img._id+"/original/"+img._id+img.extensionWithDot;
        code = '<img style="height: 24vh;" src="'+src+'" alt="'+img.name+'" />';
      }
      return code;
    }
  },
  
    
  // counter() {
  //   return Template.instance().counter.get();
  // },
});

Template.page_home.events({
  // increment the counter when button is clicked
  // instance.counter.set(instance.counter.get() + 1);
});
