const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios'); // Make sure axios is installed
// Import routes (v1)
const v1aiimage = require('./routes/v1/aiimage');
const v1canvas = require('./routes/v1/canvas');
const v1chatbot = require('./routes/v1/chatbot');
const v1downloader = require('./routes/v1/downloaders');
const v1fun = require('./routes/v1/fun');
const v1stalk = require('./routes/v1/stalk');
const v1tools = require('./routes/v1/tools');

// Import routes (v2)
const v2data = require('./routes/v2/data');


const app = express();
const PORT = 3000;

// Middleware to serve static files (HTML, CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());

// Global API request counter
let apiRequestCount = 0;

// Middleware to count API requests
function apiRequestCounter(req, res, next) {
  if (req.path.startsWith('/v1/') || req.path.startsWith('/v2/') ) {
    apiRequestCount++;
  }
  next();
}

// Use the counter middleware for API routes
app.use(apiRequestCounter);

// Use versioned routes (v1)
app.use('/v1/aiimage', v1aiimage);
app.use('/v1/canvas', v1canvas);
app.use('/v1/chatbot', v1chatbot);
app.use('/v1/downloaders', v1downloader);
app.use('/v1/fun', v1fun);
app.use('/v1/stalk', v1stalk);
app.use('/v1/tools', v1tools);

// Use versioned routes (v2)
app.use('/v2/data', v2data);

// Endpoint to get the API request count
app.get('/api/request-count', (req, res) => {
  res.json({ count: apiRequestCount });
});



// List of API endpoints to check

const apiEndpoints = [
  // Chatbot
  { name: "Chatbot A", url: "https://coderx-api.onrender.com/v1/chatbot/coderx/chatbot?query=test" },
  { name: "Blackbox", url: "https://coderx-api.onrender.com/v1/chatbot/coderx/blackbox?q=test query" },
  { name: "iLama 3", url: "https://coderx-api.onrender.com/v1/chatbot/coderx/ilama3?text=Sample text" },

  // Downloads
  { name: "YouTube Search", url: "https://coderx-api.onrender.com/v1/downloaders/coderx/download/ytsearch?message=hello" },
  { name: "YouTube MP3", url: "https://coderx-api.onrender.com/v1/downloaders/coderx/download/ytmp3?url=https://youtu.be/dQw4w9WgXcQ" },
  { name: "YouTube MP4", url: "https://coderx-api.onrender.com/v1/downloaders/coderx/download/ytmp4?url=https://youtu.be/dQw4w9WgXcQ" },
  { name: "Facebook Downloader", url: "https://coderx-api.onrender.com/v1/downloaders/coderx/download/facebook?url=https://www.facebook.com/share/v/15fNp5gHK4/" },
  { name: "Instagram Downloader", url: "https://coderx-api.onrender.com/v1/downloaders/coderx/download/instagram?url=https://www.instagram.com/reel/DD6q97IuzxD/" },
  { name: "TikTok Downloader", url: "https://coderx-api.onrender.com/v1/downloaders/coderx/download/tiktok?url=https://vm.tiktok.com/ZMkMuEmmd" },
  { name: "Twitter Downloader", url: "https://coderx-api.onrender.com/v1/downloaders/coderx/download/twitter?url=https://x.com/elonmusk/status/1870901510319833540" },
  { name: "Spotify Downloader", url: "https://coderx-api.onrender.com/v1/downloaders/coderx/download/spotifydl?url=https://open.spotify.com/track/285pBltuF7vW8TeWk8hdRR" },
  { name: "Movies Downloader", url: "https://coderx-api.onrender.com/v1/downloaders/coderx/download/movies?q=deadpool" },

  // Tools
  { name: "Lyrics", url: "https://coderx-api.onrender.com/v1/tools/coderx/lyrics?song=never+gonna+give+you+up" },
  { name: "Bible Reference", url: "https://coderx-api.onrender.com/v1/tools/coderx/bible?reference=john+3:16" },
  { name: "IMDb", url: "https://coderx-api.onrender.com/v1/tools/coderx/imdb?q=iron+man" },
  { name: "Voice AI", url: "https://coderx-api.onrender.com/v1/tools/coderx/voiceai?text=iron+man&model=optimus_prime" },
  { name: "Couple PP", url: "https://coderx-api.onrender.com/v1/tools/coderx/couplepp" },
  { name: "Meme Generator", url: "https://coderx-api.onrender.com/v1/tools/coderx/meme" },
  { name: "Emoji Mix", url: "https://coderx-api.onrender.com/v1/tools/coderx/emojimix?emoji=😎&emoji2=😂" },
  { name: "NSFW Check", url: "https://coderx-api.onrender.com/v1/tools/coderx/nsfwcheck?url=https://i.pinimg.com/474x/0a/c6/6f/0ac66f6cf7a4f74f9e435037dea7492e.jpg" },

  // Fun
  { name: "Truth", url: "https://coderx-api.onrender.com/v1/fun/coderx/truth" },
  { name: "Dare", url: "https://coderx-api.onrender.com/v1/fun/coderx/dare" },
  { name: "Pickup Line", url: "https://coderx-api.onrender.com/v1/fun/coderx/pickupline" },
  { name: "Fact", url: "https://coderx-api.onrender.com/v1/fun/coderx/fact" },
  { name: "Joke", url: "https://coderx-api.onrender.com/v1/fun/coderx/joke" },
  { name: "Would You Rather", url: "https://coderx-api.onrender.com/v1/fun/coderx/wyr" },

  // Stalk
  { name: "TikTok Stalker", url: "https://coderx-api.onrender.com/v1/stalk/coderx/tiktokstalk?q=davido" },
  { name: "FF Stalker", url: "https://coderx-api.onrender.com/v1/stalk/coderx/ffstalk?id=8533270051" },
  { name: "GitHub Stalker", url: "https://coderx-api.onrender.com/v1/stalk/coderx/github?name=coderxsa" },
];

let apiStatus = {};
let successCount = 0;

// Function to check API status
const checkApis = async () => {
  successCount = 0;

  for (const endpoint of apiEndpoints) {
    try {
      const response = await axios.get(endpoint.url, { timeout: 5000 });
      if (response.status === 200) {
        apiStatus[endpoint.name] = { status: "Online ✅", url: endpoint.url };
        successCount++;
      } else {
        apiStatus[endpoint.name] = { status: "Offline ❌", url: endpoint.url };
      }
    } catch (error) {
      apiStatus[endpoint.name] = { status: "Offline ❌", url: endpoint.url };
    }
  }
};

// Run check on server start and every 20 minutes
checkApis();
setInterval(checkApis, 1200000); // 20 minutes

// Serve API status
app.get('/api/status', (req, res) => {
  res.json({
    totalApis: apiEndpoints.length,
    successCount,
    status: apiStatus
  });
});



// Catch-all route for any other requests (fallback to your HTML file)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

