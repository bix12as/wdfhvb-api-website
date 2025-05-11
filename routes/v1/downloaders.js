const express = require('express');
const axios = require('axios');
const path = require('path');
const apiUrls = require(path.join(__dirname, '../../api.json'));

const router = express.Router();



router.get('/coderx/download/ytmp3v2', async (req, res) => {
  try {
    const query = req.query.query;  // This will fetch the "query" parameter from the request

    // Check if query parameter is provided
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    // API URL for YouTube search (text-based query)
    const apiUrl = apiUrls.api_ytmp3v2;

    // Make a request to the external API with the query parameter
    const response = await axios.get(apiUrl, {
      params: { query },  // Send the query text as a parameter
    });

    // Check if response data is valid before accessing it
    if (!response.data || !response.data.result) {
      return res.status(500).json({ error: "Invalid response from the API." });
    }

    // Transform the API response into the desired format
    const modifiedResponse = {
      creator: "CODERX",
      status: response.data.success ? "ok" : "error",
      success: response.data.success,
      result: {
        type: response.data.result.type,
        videoId: response.data.result.videoId,
        url: response.data.result.url,
        title: response.data.result.title,
        description: response.data.result.description,
        image: response.data.result.image,
        thumbnail: response.data.result.thumbnail,
        seconds: response.data.result.seconds,
        timestamp: response.data.result.timestamp,
        duration: response.data.result.duration,
        ago: response.data.result.ago,
        views: response.data.result.views,
        author: {
          name: response.data.result.author.name,
          url: response.data.result.author.url
        },
        download: {
          audio: response.data.result.download.audio,
          video: response.data.result.download.video
        }
      }
    };

    res.json(modifiedResponse);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Contact: +27 71 731 1486 : Server Down' });
  }
});



router.get('/coderx/download/facebook', async (req, res) => {
  try {
    const url = req.query.url;
    const response = await axios.get(apiUrls.api_facebook, {
      params: { url }
    });

    if (response.data && response.data.status && Array.isArray(response.data.data)) {
      const hdDownload = response.data.data.find(
        download => download.resolution.includes("720p") || download.resolution.includes("HD")
      );

      if (hdDownload) {
        const modifiedResponse = {
          creator: "CODERX",
          status: response.data.status,
          success: true,
          video: {
            title: "Unknown (API does not provide title)",  // Adjust if title is elsewhere
            thumbnail: "N/A",  // Adjust if thumbnail is elsewhere
            hdDownloadUrl: hdDownload.url,
          },
        };
        res.json(modifiedResponse);
      } else {
        res.status(400).json({ error: 'HD download link not available' });
      }
    } else {
      res.status(400).json({ error: 'Invalid response structure from the external API' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Contact: +27 71 731 1486 : Server Down' });
  }
});



router.get('/coderx/download/instagram', async (req, res) => {
  try {
    const url = req.query.url;

    const response = await axios.get(apiUrls.api_instagram, {
      params: { url }
    });

    const data = response.data.data || {};
    const videoLinks = Array.isArray(data.videoLinks) ? data.videoLinks : [];
    const thumbnail = data.thumbnail || null;
    const title = data.title || "";

    const modifiedResponse = {
      creator: "CODERX",
      status: response.data.status,
      success: true,
      type: "instagram",
      title,
      thumbnail,
      downloadLinks: videoLinks.map(link => ({
        quality: link.quality?.replace(/\s+/g, ' ').trim(),
        url: link.url
      }))
    };

    res.json(modifiedResponse);
  } catch (error) {
    res.status(500).json({ error: 'Contact: +27 71 731 1486 : Server Down' });
  }
});



router.get('/coderx/download/tiktok', async (req, res) => {
  try {
    const url = req.query.url;
    const response = await axios.get(apiUrls.api_tiktok, {
      params: { url }
    });

    const data = response.data.data;

    if (!data || !data.download || !data.download.video || data.download.video.length === 0) {
      return res.status(404).json({ error: 'No video download link found' });
    }

    const modifiedResponse = {
      creator: "CODERX",
      status: 200,
      success: true,
      result: {
        id: response.data.postId,
        title: data.metadata.title || '',
        description: data.metadata.description || '',
        location: data.metadata.locationCreated || 'Unknown',
        stats: {
          likes: data.metadata.stats.likeCount,
          views: data.metadata.stats.playCount,
          comments: data.metadata.stats.commentCount,
          shares: data.metadata.stats.shareCount
        },
        video_urls: {
          nowatermark_sd: data.download.video[0] || null,
          nowatermark_hd: data.download.video[1] || null,
          alternative: data.download.video[2] || null
        },
        audio_url: data.download.audio
      }
    };

    res.json(modifiedResponse);
  } catch (error) {
    res.status(500).json({ error: 'Contact: +27 71 731 1486 : Server Down' });
  }
});




router.get('/coderx/download/twitter', async (req, res) => {
  try {
    const url = req.query.url;

    const response = await axios.get(apiUrls.api_twitter, {
      params: { url }
    });

    if (response.data && response.data.status && response.data.data) {
      const twitterData = response.data.data;

      const modifiedResponse = {
        creator: "CODERX",
        status: response.data.status,
        success: true,
        title: twitterData.videoTitle || "Untitled",
        description: twitterData.videoDescription || "No description",
        thumbnail: twitterData.imgUrl,
        downloadUrl: twitterData.downloadLink
      };

      res.json(modifiedResponse);
    } else {
      res.status(400).json({ error: 'Invalid response structure from the external Twitter API' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Contact: +27 71 731 1486 : Server Down' });
  }
});



router.get('/coderx/download/spotifydl', async (req, res) => {
  try {
    const url = req.query.url;

    const response = await axios.get(apiUrls.api_spotifydl, {
      params: { url }
    });

    if (response.data && response.data.status && response.data.data) {
      const data = response.data.data;

      const modifiedResponse = {
        creator: "CODERX",
        status: true,
        success: true,
        title: data.title,
        type: data.type,
        channel: data.artis, // Artist or band name
        duration: data.durasi, // Duration in milliseconds
        thumbnail: data.image,
        downloadLink: data.download
      };

      res.json(modifiedResponse);
    } else {
      res.status(400).json({ error: 'Invalid response from Spotify API' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Contact: +27 71 731 1486 : Server Down' });
  }
});





module.exports = router;
