const express = require('express');
const axios = require('axios');
const path = require('path');
const apiUrls = require(path.join(__dirname, '../../api.json'));

const router = express.Router();


router.get('/coderx/chatbot', async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    // Call the AI Chatbot API
    const response = await axios.get(apiUrls.api_chatbot, {
      params: {
        prompt: 'You are an assistant that always responds in English with a friendly and informal tone, u are owned by coderxsa.',
        message: query,
      },
    });

    // Modify the response
    const modifiedResponse = {
      creator: "CODERX",
      status: response.data.status,
      success: true,
      result: response.data.data,
    };

    res.json(modifiedResponse);
  } catch (error) {
    res.status(500).json({ error: 'Contact: +27 71 731 1486 : Server Down' });
  }
});




module.exports = router;
