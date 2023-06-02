import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { Profiles } from '../../api/profiles/profiles.js';
import { Presentations } from '../../api/presentations/presentations.js';
import { Notes } from '../../api/notes/notes.js';
import { Bookmarks } from '../../api/bookmarks/bookmarks.js';
import { Versions } from '../../api/versions/versions.js';
import { Books } from '../../api/books/books.js';
import { Stations } from '../../api/stations/stations.js';
import { Playlists } from '../../api/playlists/playlists.js';

/*
Accounts.validateNewUser(function (user) {
  import { Roles } from 'meteor/alanning:roles'
  var loggedInUser = Meteor.user();
  if (Roles.userIsInRole(loggedInUser, ['admin'])) {
    return true;
  }
  throw new Meteor.Error('unauthorized', "Not authorized to create new users");
});

*/

// Main Users
var users = [
  {name:"iamdefjr",email:"iamdefjr@gmail.com",pass:"Jesus&me234",roles:[]},
  {name:"amg2nd",email:"amg2nd@gmail.com",pass:"34Present*",roles:['admin']}
];

Meteor.startup(() => {
  // if Main Users don't exist
  users.forEach(function (user) {
    if (!Accounts.findUserByUsername(user.name)) {
      var id;

      id = Accounts.createUser({
        username: user.name,
        email: user.email,
        password: user.pass,
      });
      
      
      // if the Notes collection is empty
      if (user.name == 'amg2nd' && Notes.find().count() === 0) {
        const data = [
          {
            title: 'Our Pledge',
            note: '<p class="slide">I pledge allegiance<br>to the word of God.<br>It will, lead me<br>it will, guide me<br>it will, change me<br>and draw me closer<br>to my savior and lord<br>Yahshua!</p>',
            userId: id,
            createdAt: new Date(),
          },
        ];
        data.forEach(note => Notes.insert(note));
      }

      if (Meteor.roleAssignment.find({ 'user._id': id }).count() === 0) {
        import { Roles } from 'meteor/alanning:roles';
        
        user.roles.forEach(function (role) {
          Roles.createRole(role, {unlessExists: true});
        });
        // Need _id of existing user record so this call must come after `Accounts.createUser`.
        Roles.addUsersToRoles(id, user.roles);
      }
    }
  });
  // if the Profiles collection is empty
  if (Profiles.find().count() === 0) {
    const data = [
      {
        title: "The Children's Sanctuary Church",
        shortCode: 'tcsc',
        createdAt: new Date(),
      },
    ];
    data.forEach(profile => Profiles.insert(profile));
  }
  // if the Presentations collection is empty
  if (Presentations.find().count() === 0) {
    const data = [
      {
        page: '',
        title: 'Presentation Page',
        code: '<div>Presentation Page</div>',
        position: '',
        next: '',
        createdAt: new Date(),
      },
    ];
    data.forEach(presentation => Presentations.insert(presentation));
  }
  // if the Playlists collection is empty
  if (Playlists.find().count() === 0) {
    const data = [
      {
        title: 'Worship - Sunday',
        list: 'PLvP7cLneIyNJAt7mKmyG5Vfsmm9b-g_4w',
        createdAt: new Date(),
      },
      {
        title: 'Worship - Wednesday',
        list: 'PLvP7cLneIyNLj7K4wmvtxRNSdwejm5kfB',
        createdAt: new Date(),
      },
      {
        title: 'Worship - Friday',
        list: 'PLvP7cLneIyNIq7iZUSmLx_LllRHwB6OoI',
        createdAt: new Date(),
      },
    ];
    data.forEach(playlist => Playlists.insert(playlist));
  }
  // if the Stations collection is empty
  if (Stations.find().count() === 0) {
    const data = [
      {
        title: 'K-LOVE - Positive, Encouraging K-LOVE',
        url: 'https://www.iheart.com/live/k-love-5162/',
        createdAt: new Date(),
      },
      {
        title: 'Hallelujah - Gospel & Inspirational Music',
        url: 'https://www.iheart.com/live/hallelujah-7005/',
        createdAt: new Date(),
      },
      {
        title: 'Up! - Uplifting Contemporary Christian Hits',
        url: 'https://www.iheart.com/live/up-7203/',
        createdAt: new Date(),
      },
    ];
    data.forEach(station => Stations.insert(station));
  }
  // if the Versions collection is empty
  if (Versions.find().count() === 0) {
    const data = [
      {
        title: 'Amplified Bible',
        shortCode: 'AMP',
        createdAt: new Date(),
      },
      {
        title: 'King James Version',
        shortCode: 'KJV',
        createdAt: new Date(),
      },
      {
        title: 'The Message',
        shortCode: 'MSG',
        createdAt: new Date(),
      },
      {
        title: 'New International Version',
        shortCode: 'NIV',
        createdAt: new Date(),
      },
      {
        title: 'New King James Version',
        shortCode: 'NKJV',
        createdAt: new Date(),
      },
      {
        title: 'New Living Translation',
        shortCode: 'NLT',
        createdAt: new Date(),
      },
    ];
    data.forEach(version => Versions.insert(version));
  }
  // if the Books collection is empty
  if (Books.find().count() === 0) {
    const data = [
      {
        title: 'Genesis',
        shortCode: 'Gen',
        verseCount: [31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],
        createdAt: new Date(),
      },
      {
        title: 'Exodus',
        shortCode: 'Exod',
        verseCount: [22,25,22,31,23,30,25,32,35,29,10,51,22,31,27,36,16,27,25,26,36,31,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38],
        createdAt: new Date(),
      },
      {
        title: 'Leviticus',
        shortCode: 'Lev',
        verseCount: [17,16,17,35,19,30,38,36,24,20,47,8,59,57,33,34,16,30,37,27,24,33,44,23,55,46,34],
        createdAt: new Date(),
      },
      {
        title: 'Numbers',
        shortCode: 'Num',
        verseCount: [54,34,51,49,31,27,89,26,23,36,35,16,33,45,41,50,13,32,22,29,35,41,30,25,18,65,23,31,40,16,54,42,56,29,34,13],
        createdAt: new Date(),
      },
      {
        title: 'Deuteronomy',
        shortCode: 'Deut',
        verseCount: [46,37,29,49,33,25,26,20,29,22,32,32,18,29,23,22,20,22,21,20,23,30,25,22,19,19,26,68,29,20,30,52,29,12],
        createdAt: new Date(),
      },
      {
        title: 'Joshua',
        shortCode: 'Josh',
        verseCount: [18,24,17,24,15,27,26,35,27,43,23,24,33,15,63,10,18,28,51,9,45,34,16,33],
        createdAt: new Date(),
      },
      {
        title: 'Judges',
        shortCode: 'Judg',
        verseCount: [36,23,31,24,31,40,25,35,57,18,40,15,25,20,20,31,13,31,30,48,25],
        createdAt: new Date(),
      },
      {
        title: 'Ruth',
        shortCode: 'Ruth',
        verseCount: [22,23,18,22],
        createdAt: new Date(),
      },
      {
        title: '1 Samuel',
        shortCode: '1Sam',
        verseCount: [28,36,21,22,12,21,17,22,27,27,15,25,23,52,35,23,58,30,24,42,15,23,29,22,44,25,12,25,11,31,13],
        createdAt: new Date(),
      },
      {
        title: '2 Samuel',
        shortCode: '2Sam',
        verseCount: [27,32,39,12,25,23,29,18,13,19,27,31,39,33,37,23,29,33,43,26,22,51,39,25],
        createdAt: new Date(),
      },
      {
        title: '1 Kings',
        shortCode: '1Kgs',
        verseCount: [53,46,28,34,18,38,51,66,28,29,43,33,34,31,34,34,24,46,21,43,29,53],
        createdAt: new Date(),
      },
      {
        title: '2 Kings',
        shortCode: '2Kgs',
        verseCount: [18,25,27,44,27,33,20,29,37,36,21,21,25,29,38,20,41,37,37,21,26,20,37,20,30],
        createdAt: new Date(),
      },
      {
        title: '1 Chronicles',
        shortCode: '1Chr',
        verseCount: [54,55,24,43,26,81,40,40,44,14,47,40,14,17,29,43,27,17,19,8,30,19,32,31,31,32,34,21,30],
        createdAt: new Date(),
      },
      {
        title: '2 Chronicles',
        shortCode: '2Chr',
        verseCount: [17,18,17,22,14,42,22,18,31,19,23,16,22,15,19,14,19,34,11,37,20,12,21,27,28,23,9,27,36,27,21,33,25,33,27,23],
        createdAt: new Date(),
      },
      {
        title: 'Ezra',
        shortCode: 'Ezra',
        verseCount: [11,70,13,24,17,22,28,36,15,44],
        createdAt: new Date(),
      },
      {
        title: 'Nehemiah',
        shortCode: 'Neh',
        verseCount: [11,20,32,23,19,19,73,18,38,39,36,47,31],
        createdAt: new Date(),
      },
      {
        title: 'Esther',
        shortCode: 'Esth',
        verseCount: [22,23,15,17,14,14,10,17,32,3],
        createdAt: new Date(),
      },
      {
        title: 'Job',
        shortCode: 'Job',
        verseCount: [22,13,26,21,27,30,21,22,35,22,20,25,28,22,35,22,16,21,29,29,34,30,17,25,6,14,23,28,25,31,40,22,33,37,16,33,24,41,30,24,34,17],
        createdAt: new Date(),
      },
      {
        title: 'Psalms',
        shortCode: 'Ps',
        verseCount: [6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,12,24,11,22,22,28,12,40,22,13,17,13,11,5,26,17,11,9,14,20,23,19,9,6,7,23,13,11,11,17,12,8,12,11,10,13,20,7,35,36,5,24,20,28,23,10,12,20,72,13,19,16,8,18,12,13,17,7,18,52,17,16,15,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,13,10,7,12,15,21,10,20,14,9,6],
        createdAt: new Date(),
      },
      {
        title: 'Proverbs',
        shortCode: 'Prov',
        verseCount: [33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31],
        createdAt: new Date(),
      },
      {
        title: 'Ecclesiastes',
        shortCode: 'Eccl',
        verseCount: [18,26,22,16,20,12,29,17,18,20,10,14],
        createdAt: new Date(),
      },
      {
        title: 'Song of Solomon',
        shortCode: 'Song',
        verseCount: [17,17,11,16,16,13,13,14],
        createdAt: new Date(),
      },
      {
        title: 'Isaiah',
        shortCode: 'Isa',
        verseCount: [31,22,26,6,30,13,25,22,21,34,16,6,22,32,9,14,14,7,25,6,17,25,18,23,12,21,13,29,24,33,9,20,24,17,10,22,38,22,8,31,29,25,28,28,25,13,15,22,26,11,23,15,12,17,13,12,21,14,21,22,11,12,19,12,25,24],
        createdAt: new Date(),
      },
      {
        title: 'Jeremiah',
        shortCode: 'Jer',
        verseCount: [19,37,25,31,31,30,34,22,26,25,23,17,27,22,21,21,27,23,15,18,14,30,40,10,38,24,22,17,32,24,40,44,26,22,19,32,21,28,18,16,18,22,13,30,5,28,7,47,39,46,64,34],
        createdAt: new Date(),
      },
      {
        title: 'Lamentations',
        shortCode: 'Lam',
        verseCount: [22,22,66,22,22],
        createdAt: new Date(),
      },
      {
        title: 'Ezekiel',
        shortCode: 'Ezek',
        verseCount: [28,10,27,17,17,14,27,18,11,22,25,28,23,23,8,63,24,32,14,49,32,31,49,27,17,21,36,26,21,26,18,32,33,31,15,38,28,23,29,49,26,20,27,31,25,24,23,35],
        createdAt: new Date(),
      },
      {
        title: 'Daniel',
        shortCode: 'Dan',
        verseCount: [21,49,30,37,31,28,28,27,27,21,45,13],
        createdAt: new Date(),
      },
      {
        title: 'Hosea',
        shortCode: 'Hos',
        verseCount: [11,23,5,19,15,11,16,14,17,15,12,14,16,9],
        createdAt: new Date(),
      },
      {
        title: 'Joel',
        shortCode: 'Joel',
        verseCount: [20,32,21],
        createdAt: new Date(),
      },
      {
        title: 'Amos',
        shortCode: 'Amos',
        verseCount: [15,16,15,13,27,14,17,14,15],
        createdAt: new Date(),
      },
      {
        title: 'Obadiah',
        shortCode: 'Obad',
        verseCount: [21],
        createdAt: new Date(),
      },
      {
        title: 'Jonah',
        shortCode: 'Jonah',
        verseCount: [17,10,10,11],
        createdAt: new Date(),
      },
      {
        title: 'Micah',
        shortCode: 'Mic',
        verseCount: [16,13,12,13,15,16,20],
        createdAt: new Date(),
      },
      {
        title: 'Nahum',
        shortCode: 'Nah',
        verseCount: [15,13,19],
        createdAt: new Date(),
      },
      {
        title: 'Habakkuk',
        shortCode: 'Hab',
        verseCount: [17,20,19],
        createdAt: new Date(),
      },
      {
        title: 'Zephaniah',
        shortCode: 'Zeph',
        verseCount: [18,15,20],
        createdAt: new Date(),
      },
      {
        title: 'Haggai',
        shortCode: 'Hag',
        verseCount: [15,23],
        createdAt: new Date(),
      },
      {
        title: 'Zechariah',
        shortCode: 'Zech',
        verseCount: [21,13,10,14,11,15,14,23,17,12,17,14,9,21],
        createdAt: new Date(),
      },
      {
        title: 'Malachi',
        shortCode: 'Mal',
        verseCount: [14,17,18,6],
        createdAt: new Date(),
      },
      {
        title: 'Matthew',
        shortCode: 'Matt',
        verseCount: [25,23,17,25,48,34,29,34,38,42,30,50,58,36,39,28,27,35,30,34,46,46,39,51,46,75,66,20],
        createdAt: new Date(),
      },
      {
        title: 'Mark',
        shortCode: 'Mark',
        verseCount: [45,28,35,41,43,56,37,38,50,52,33,44,37,72,47,20],
        createdAt: new Date(),
      },
      {
        title: 'Luke',
        shortCode: 'Luke',
        verseCount: [80,52,38,44,39,49,50,56,62,42,54,59,35,35,32,31,37,43,48,47,38,71,56,53],
        createdAt: new Date(),
      },
      {
        title: 'John',
        shortCode: 'John',
        verseCount: [51,25,36,54,47,71,53,59,41,42,57,50,38,31,27,33,26,40,42,31,25],
        createdAt: new Date(),
      },
      {
        title: 'Acts',
        shortCode: 'Acts',
        verseCount: [26,47,26,37,42,15,60,40,43,48,30,25,52,28,41,40,34,28,41,38,40,30,35,27,27,32,44,31],
        createdAt: new Date(),
      },
      {
        title: 'Romans',
        shortCode: 'Rom',
        verseCount: [32,29,31,25,21,23,25,39,33,21,36,21,14,26,33,25],
        createdAt: new Date(),
      },
      {
        title: '1 Corinthians',
        shortCode: '1Cor',
        verseCount: [31,16,23,21,13,20,40,13,27,33,34,31,13,40,58,24],
        createdAt: new Date(),
      },
      {
        title: '2 Corinthians',
        shortCode: '2Cor',
        verseCount: [24,17,18,18,21,18,16,24,15,18,33,21,14],
        createdAt: new Date(),
      },
      {
        title: 'Galatians',
        shortCode: 'Gal',
        verseCount: [24,21,29,31,26,18],
        createdAt: new Date(),
      },
      {
        title: 'Ephesians',
        shortCode: 'Eph',
        verseCount: [23,22,21,32,33,24],
        createdAt: new Date(),
      },
      {
        title: 'Philippians',
        shortCode: 'Phil',
        verseCount: [30,30,21,23],
        createdAt: new Date(),
      },
      {
        title: 'Colossians',
        shortCode: 'Col',
        verseCount: [29,23,25,18],
        createdAt: new Date(),
      },
      {
        title: '1 Thessalonians',
        shortCode: '1Thess',
        verseCount: [10,20,13,18,28],
        createdAt: new Date(),
      },
      {
        title: '2 Thessalonians',
        shortCode: '2Thess',
        verseCount: [12,17,18],
        createdAt: new Date(),
      },
      {
        title: '1 Timothy',
        shortCode: '1Tim',
        verseCount: [20,15,16,16,25,21],
        createdAt: new Date(),
      },
      {
        title: '2 Timothy',
        shortCode: '2Tim',
        verseCount: [18,26,17,22],
        createdAt: new Date(),
      },
      {
        title: 'Titus',
        shortCode: 'Titus',
        verseCount: [16,15,15],
        createdAt: new Date(),
      },
      {
        title: 'Philemon',
        shortCode: 'Phlm',
        verseCount: [25],
        createdAt: new Date(),
      },
      {
        title: 'Hebrews',
        shortCode: 'Heb',
        verseCount: [14,18,19,16,14,20,28,13,28,39,40,29,25],
        createdAt: new Date(),
      },
      {
        title: 'James',
        shortCode: 'Jas',
        verseCount: [27,26,18,17,20],
        createdAt: new Date(),
      },
      {
        title: '1 Peter',
        shortCode: '1Pet',
        verseCount: [25,25,22,19,14],
        createdAt: new Date(),
      },
      {
        title: '2 Peter',
        shortCode: '2Pet',
        verseCount: [21,22,18],
        createdAt: new Date(),
      },
      {
        title: '1 John',
        shortCode: '1John',
        verseCount: [10,29,24,21,21],
        createdAt: new Date(),
      },
      {
        title: '2 John',
        shortCode: '2John',
        verseCount: [13],
        createdAt: new Date(),
      },
      {
        title: '3 John',
        shortCode: '3John',
        verseCount: [14],
        createdAt: new Date(),
      },
      {
        title: 'Jude',
        shortCode: 'Jude',
        verseCount: [25],
        createdAt: new Date(),
      },
      {
        title: 'Revelation',
        shortCode: 'Rev',
        verseCount: [20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21],
        createdAt: new Date(),
      },
    ];
    data.forEach(book => Books.insert(book));
  }
});
