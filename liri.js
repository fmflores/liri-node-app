require("dotenv").config();
const {prompt} = require('inquirer');
var keys = require("./keys.js");
var axios = require('axios');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var moment = require('moment');

var spotify = new Spotify(keys.spotify);

const initPrompt = {
    message: "welcome to liri, what would you like to do?",
    name: "choices",
    type: 'list',
    choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says']
}

async function init(){
    const {choices} = await prompt(initPrompt);
    switch (choices){
        case 'concert-this':
            concertThis();
            break;
        case 'spotify-this-song':
            spotifyThis();
            break;
        case 'movie-this':
            movieThis();
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
    }
}

async function concertThis(){
    const {band} = await prompt({message: "Please enter artist/band name", name: 'band'});
    //api call here
    const {data} = await axios.get(`https://rest.bandsintown.com/artists/${band}/events/?app_id=codingbootcamp`);

    for (var i = 0; i < data.length; i++) {
        var venue = data[i].venue.name;
        var location = data[i].venue.location;
        var date = data[i].datetime;



        console.log(`\nVenue: ${venue}\nLocation: ${location}\nDate: ${moment(date).format("MM/DD/YYYY")}\n`);
    }
    
}

async function spotifyThis(){
    const {song} = await prompt({message: "Please enter song name", name: 'song'});
    //api call here
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        for (var i = 0; i < data.tracks.items.length; i++) {
            const songName = data.tracks.items[i].name;
            const preview = data.tracks.items[i].preview_url;
            const album = data.tracks.items[i].album.name;

            console.log(`\nSong Name: ${songName}\nPreview Song: ${preview}\nAlbum: ${album}`);
        }
    
 })
}

init();
