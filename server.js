const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

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


// Catch-all route for any other requests (fallback to your HTML file)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

