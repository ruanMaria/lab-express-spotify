require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body.access_token))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (request, response) => response.render("index"));

app.get("/artists", (request, response) =>
  spotifyApi
    .searchArtists(request.query.name)
    .then((data) => response.render("artists", { artists: data.body.artists.items }))
    .catch((err) => console.log("Artist search error: ", err))
);

app.get("/albums/:id", (request, response) =>
  spotifyApi
    .getArtistAlbums(request.params.id)
    .then((data) => response.render("albums", { albums: data.body.items }))
    .catch((err) => console.log("Album retrieval error: ", err))
);

app.get("/songs/:id", (request, response) =>
  spotifyApi
    .getAlbumTracks(request.params.id)
    .then((data) => response.render("songs", { songs: data.body.items }))
    .catch((err) => console.log("Album songs retrieval error: ", err))
);


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
