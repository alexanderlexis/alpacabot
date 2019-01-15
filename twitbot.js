'use strict';

console.log('Alpacabot is starting');

var Twit = require('twit');
var fs = require('fs');
var config = require('./config');
var request = require('request');
var googleIms = require('google-ims');

let client = googleIms(config.CseId, config.ApiKey);

getAlpaca();

// setInterval(getAlpaca, 1000*60*5);

function getAlpaca()
{

  var fullImageUrl = '';

  var number = Math.floor(Math.random()*10);

  client.search('alpaca', {
      page: number, // 10 results per page
      size: 'large', // can be: icon, small, medium, large, xlarge, xxlarge, huge
      safe: 'off', // high, medium, off
      fileType: 'jpg',
      gl: 'us', // country code for results, New Zealand in this case, http://www.spoonfork.org/isocodes.html
      googlehost: 'google.com', // google domain to use, in this case New Zealand
      num: 2 // number of results per page, default 10
      
  }).then(function (images) {

    console.log(images);

    fullImageUrl = images[0].url;

    // console.log(fullImageUrl);

    var imageJpgUrl = fullImageUrl.substring(0, fullImageUrl.indexOf('.jpg')) + '.jpg';

    // console.log(imageJpgUrl);

    request(imageJpgUrl).pipe(fs.createWriteStream('img/alpaca.jpg'));

    // setTimeout(tweetAlpaca,1000*5);
  });
}

var T = new Twit(config);

function tweetAlpaca()
{
  var b64content = fs.readFileSync('img/alpaca.jpg', { encoding: 'base64' })

  // first we must post the media to Twitter
  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string;
    var altText = "Have an alpaca to brighten  up your day";
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

    // console.log(data);

    T.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
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

// var searchParams = {
//     q: 'alpaca', 
//     count: 1,
//     geocode: '', //37.781157 -122.398720 1mi
//     lang: 'en', //ISO 639-1 language, bijv: eu
//     locale: '', // ja (indien japan)
//     result_type: 'recent', // mixed recent of popular
//     until: '', // 2015-07-19
//     since_id: '', // 12345
//     max_id: '' // 12345
// };


// function showData(err, data, response) 
// {
  
//   var tweets = data.statuses;
  
//   for (var i = 0 ; i < tweets.length ; i++){
//       console.log(tweets[i].user.name + ': ' + tweets[i].text);
//      // console.log(tweets[i]);
//   }
  
// };

// function tweeted(err, data, response) 
// {
//   if(err){
//     console.log('Doet het niet');
//   } else {
//     console.log(data);
//   }
// }

// function tweet()
// {
//   var number = Math.floor(Math.random()*100);

//   var status = {status: 'Alpaca testing ' + number};

//   T.post('statuses/update', status, tweeted);

// }

// tweet();

// T.get('search/tweets', searchParams, showData);




