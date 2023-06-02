// Definition of the UserFiles collection
import { FilesCollection } from 'meteor/ostrio:files';

// Declare the Meteor file collection on the Client
export const UserFiles = new FilesCollection({
  debug: false, // Change to `true` for debugging
  storagePath: 'assets/app/uploads/uploadedFiles',
  collectionName: 'userFiles',
  // Disallow Client to execute remove, use the Meteor.method
  allowClientCode: false,
});
