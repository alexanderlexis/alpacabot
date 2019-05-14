'use strict';

console.log('Alpacabot is starting');

var Twit = require('twit');
var fs = require('fs');
var config = require('./config');
var request = require('request');
var googleIms = require('google-ims');

let client = googleIms(config.CseId, config.ApiKey);

// Will get 1 image and tweet once when run
getAlpaca();

// Want to tweet on the regular? Uncomment the line below to tweet every 5 minutes or change to whatever
// setInterval(getAlpaca, 1000*60*5);

function getAlpaca()
{

  var fullImageUrl = '';

  var number = Math.floor(Math.random()*10);

  client.search('alpaca', {
      page: number, // 10 results per page
      size: 'large',
      safe: 'off', // high, medium, off
      fileType: 'jpg',
      gl: 'us', //country codes found on http://www.spoonfork.org/isocodes.html
      googlehost: 'google.com', // Google domain to use
      num: 2 // number of results per page
      
  }).then(function (images) {

    console.log(images);

    fullImageUrl = images[0].url;

    var imageJpgUrl = fullImageUrl.substring(0, fullImageUrl.indexOf('.jpg')) + '.jpg';

    request(imageJpgUrl).pipe(fs.createWriteStream('img/alpaca.jpg'));

    setTimeout(tweetAlpaca,1000*5);
  });
}

var T = new Twit(config);

function tweetAlpaca()
{
  var b64content = fs.readFileSync('img/alpaca.jpg', { encoding: 'base64' })

  // Post the image to twitter
  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    var mediaIdStr = data.media_id_string;
    var altText = "Have an alpaca to brighten  up your day";
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // Send a status to tweet (media will attach to the tweet)
        var params = { status: 'You love Alpacabot and Alpacabot loves you #alpaca', media_ids: [mediaIdStr] }

        T.post('statuses/update', params, function (err, data, response) {
          if(!err){
            console.log('Alpaca succesfully released into the wild');
          } else {
            console.log('Something went wrong');
          }
        })
      }
    })
  })
}




