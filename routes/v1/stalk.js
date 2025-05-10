const express = require('express');
const axios = require('axios');
const router = express.Router();
const path = require('path');
const apiUrls = require(path.join(__dirname, '../../api.json'));



  
// github stalk
router.get('/coderx/github', async (req, res) => {
  try {
    const username = req.query.name; // Extract the username parameter from the query string

    if (!username) {
      return res.status(400).json({ error: 'Username parameter is required' });
    }

    // Make a request to the GitHub Stalk API
    const response = await axios.get(apiUrls.api_github, {
      params: { name: username } // Pass the username parameter as 'name'
    });

    // Modify the response data
    const modifiedResponse = {
      creator: "CODERX", // Add branding
      status: response.data.status,
      githubData: {
        login: response.data.data.login,
        id: response.data.data.id,
        avatar_url: response.data.data.avatar_url,
        html_url: response.data.data.html_url,
        name: response.data.data.name,
        company: response.data.data.company,
        blog: response.data.data.blog,
        location: response.data.data.location,
        bio: response.data.data.bio,
        twitter_username: response.data.data.twitter_username,
        public_repos: response.data.data.public_repos,
        public_gists: response.data.data.public_gists,
        followers: response.data.data.followers,
        following: response.data.data.following,
        created_at: response.data.data.created_at,
        updated_at: response.data.data.updated_at
      }
    };

    // Send the modified response back to the client
    res.json(modifiedResponse);
  } catch (error) {
    res.status(500).json({ error: 'Contact: +27 71 731 1486 : Server Down : Server Down' });
  }
});




module.exports = router;
