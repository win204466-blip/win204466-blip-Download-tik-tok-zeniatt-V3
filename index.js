const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const TIKWM_BASE_URL = 'https://www.tikwm.com/api';

async function downloadVideo(url) {
    try {
        const response = await axios.get(TIKWM_BASE_URL, {
            params: { url: url, hd: 1 },
            timeout: 15000
        });

        if (response.data.code !== 0) {
            throw new Error(response.data.msg || 'Gagal mendapatkan data dari TikTok');
        }

        const data = response.data.data;

        return {
            success: true,
            type: data.images ? 'photo' : 'video',
            data: {
                id: data.id,
                title: data.title || 'TikTok Content',
                cover: data.cover || data.origin_cover || '',
                duration: data.duration || 0,
                play: data.play || '',
                hdplay: data.hdplay || data.play || '',
                wmplay: data.wmplay || '',
                images: data.images || null,
                music: data.music || '',
                music_info: {
                    id: data.music_info?.id || '',
                    title: data.music_info?.title || '',
                    play: data.music_info?.play || '',
                    cover: data.music_info?.cover || '',
                    author: data.music_info?.author || ''
                },
                author: {
                    id: data.author?.id || '',
                    unique_id: data.author?.unique_id || '',
                    nickname: data.author?.nickname || 'TikTok User',
                    avatar: data.author?.avatar || ''
                },
                statistics: {
                    play_count: data.play_count || 0,
                    download_count: data.download_count || 0,
                    comment_count: data.comment_count || 0,
                    digg_count: data.digg_count || 0,
                    share_count: data.share_count || 0
                }
            }
        };
    } catch (error) {
        console.error('Download video error:', error.message);
        throw error;
    }
}

async function getTrendingFeed(region = 'ID', count = 30) {
    try {
        const response = await axios.get(`${TIKWM_BASE_URL}/feed/list`, {
            params: { region: region, count: count },
            timeout: 15000
        });

        if (response.data.code !== 0) {
            throw new Error(response.data.msg || 'Gagal mendapatkan trending feed');
        }

        return {
            success: true,
            data: response.data.data || [],
            region: region,
            count: response.data.data?.length || 0
        };
    } catch (error) {
        console.error('Trending feed error:', error.message);
        throw error;
    }
}

async function getUserFeed(username, count = 30, cursor = 0) {
    try {
        const response = await axios.get(`${TIKWM_BASE_URL}/user/posts`, {
            params: { 
                unique_id: username.replace('@', ''), 
                count: count,
                cursor: cursor
            },
            timeout: 15000
        });

        if (response.data.code !== 0) {
            throw new Error(response.data.msg || 'Gagal mendapatkan user feed');
        }

        return {
            success: true,
            data: response.data.data?.videos || [],
            cursor: response.data.data?.cursor || 0,
            hasMore: response.data.data?.hasMore || false,
            user: {
                unique_id: username,
                nickname: response.data.data?.user?.nickname || username
            }
        };
    } catch (error) {
        console.error('User feed error:', error.message);
        throw error;
    }
}

async function getMusicFeed(musicId, count = 30, cursor = 0) {
    try {
        const response = await axios.get(`${TIKWM_BASE_URL}/music/posts`, {
            params: { 
                music_id: musicId,
                count: count,
                cursor: cursor
            },
            timeout: 15000
        });

        if (response.data.code !== 0) {
            throw new Error(response.data.msg || 'Gagal mendapatkan music feed');
        }

        return {
            success: true,
            data: response.data.data?.videos || [],
            cursor: response.data.data?.cursor || 0,
            hasMore: response.data.data?.hasMore || false,
            music: response.data.data?.music || {}
        };
    } catch (error) {
        console.error('Music feed error:', error.message);
        throw error;
    }
}

async function searchContent(keyword, type = 'video', count = 30, cursor = 0) {
    try {
        let endpoint = `${TIKWM_BASE_URL}/feed/search`;
        
        const params = {
            keywords: keyword,
            count: count,
            cursor: cursor
        };

        if (type === 'user') {
            endpoint = `${TIKWM_BASE_URL}/feed/search`;
            params.type = 1;
        } else if (type === 'video') {
            params.type = 0;
        }

        const response = await axios.get(endpoint, {
            params: params,
            timeout: 15000
        });

        if (response.data.code !== 0) {
            throw new Error(response.data.msg || 'Gagal melakukan pencarian');
        }

        return {
            success: true,
            type: type,
            keyword: keyword,
            data: response.data.data?.videos || response.data.data || [],
            cursor: response.data.data?.cursor || 0,
            hasMore: response.data.data?.hasMore || false
        };
    } catch (error) {
        console.error('Search error:', error.message);
        throw error;
    }
}

app.post('/api/download', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ 
                success: false,
                error: 'URL TikTok diperlukan' 
            });
        }

        if (!url.toLowerCase().includes('tiktok.com') && !url.toLowerCase().includes('vm.tiktok.com')) {
            return res.status(400).json({
                success: false,
                error: 'Hanya URL TikTok yang didukung'
            });
        }

        console.log('Processing TikTok URL:', url);
        const result = await downloadVideo(url);
        res.json(result);

    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Gagal mengambil data. Pastikan URL valid dan coba lagi.',
            details: error.message 
        });
    }
});

app.get('/api/trending', async (req, res) => {
    try {
        const { region = 'ID', count = 30 } = req.query;
        
        console.log(`Fetching trending feed for region: ${region}`);
        const result = await getTrendingFeed(region, parseInt(count));
        res.json(result);

    } catch (error) {
        console.error('Error fetching trending:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Gagal mengambil trending feed',
            details: error.message 
        });
    }
});

app.get('/api/user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { count = 30, cursor = 0 } = req.query;

        if (!username) {
            return res.status(400).json({
                success: false,
                error: 'Username diperlukan'
            });
        }

        console.log(`Fetching user feed for: ${username}`);
        const result = await getUserFeed(username, parseInt(count), parseInt(cursor));
        res.json(result);

    } catch (error) {
        console.error('Error fetching user feed:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Gagal mengambil user feed',
            details: error.message 
        });
    }
});

app.get('/api/music/:musicId', async (req, res) => {
    try {
        const { musicId } = req.params;
        const { count = 30, cursor = 0 } = req.query;

        if (!musicId) {
            return res.status(400).json({
                success: false,
                error: 'Music ID diperlukan'
            });
        }

        console.log(`Fetching music feed for ID: ${musicId}`);
        const result = await getMusicFeed(musicId, parseInt(count), parseInt(cursor));
        res.json(result);

    } catch (error) {
        console.error('Error fetching music feed:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Gagal mengambil music feed',
            details: error.message 
        });
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const { keyword, type = 'video', count = 30, cursor = 0 } = req.query;

        if (!keyword) {
            return res.status(400).json({
                success: false,
                error: 'Keyword pencarian diperlukan'
            });
        }

        console.log(`Searching for: ${keyword} (type: ${type})`);
        const result = await searchContent(keyword, type, parseInt(count), parseInt(cursor));
        res.json(result);

    } catch (error) {
        console.error('Error searching:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Gagal melakukan pencarian',
            details: error.message 
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'TikTok Downloader & Tools',
        features: [
            'Video Download (HD, No Watermark)',
            'Photo/Slideshow Download',
            'Trending Feed',
            'User Feed',
            'Music Feed',
            'Search (Video, User)'
        ],
        api: 'TikWM.com',
        version: '2.0'
    });
});

if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`TikTok Tools API running on port ${PORT}`);
        console.log(`Features: Download, Trending, User Feed, Music Feed, Search`);
        console.log(`API: TikWM - No API Key Required!`);
    });
}

module.exports = app;
