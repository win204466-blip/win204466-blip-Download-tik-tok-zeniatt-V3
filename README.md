# TikTok Tools - All-in-One TikTok Downloader & Utilities

Project ini adalah aplikasi web lengkap untuk berinteraksi dengan TikTok menggunakan TikWM API. Mendukung download video/foto, trending feed, user feed, music feed, dan pencarian konten TikTok.

## 📋 Deskripsi Project

TikTok Tools adalah aplikasi web modern yang menyediakan berbagai fitur untuk berinteraksi dengan konten TikTok tanpa watermark. Aplikasi ini dibangun dengan Node.js/Express di backend dan vanilla JavaScript di frontend, dengan desain UI yang modern dan responsif.

## ✨ Fitur Utama

### 1. **Download Video/Foto** 
- Download video TikTok tanpa watermark (SD & HD)
- Download slideshow foto TikTok
- Extract audio/musik dari video
- Tampilkan informasi lengkap (judul, author, statistik)

### 2. **Trending Feed**
- Lihat video trending dari berbagai negara
- Support region: Indonesia, US, Japan, Korea, Thailand, Vietnam, dll
- Tampilkan hingga 30 video trending sekaligus

### 3. **User Feed**
- Lihat semua video dari user tertentu
- Input username (tanpa @)
- Pagination support untuk load lebih banyak video

### 4. **Music Feed**
- Lihat semua video yang menggunakan musik/sound tertentu
- Input music ID dari TikTok
- Cocok untuk trend tracking

### 5. **Search**
- Cari video berdasarkan keyword
- Cari user/creator
- Filter berdasarkan tipe pencarian

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** v22.x
- **Express.js** v4.18.2 - Web framework
- **Axios** v1.6.0 - HTTP client untuk API calls

### Frontend
- **Vanilla JavaScript** - Tidak ada framework, lebih ringan
- **Bootstrap Icons** - Icon library
- **Modern CSS** - Gradient, animations, responsive design

### API
- **TikWM API** (tikwm.com) - Free TikTok data extraction API
- Rate limit: ~5,000 requests/day per IP
- Tidak memerlukan API key

## 📁 Struktur Project

```
.
├── index.js                 # Backend server (Express)
├── package.json             # Dependencies & scripts
├── vercel.json              # Konfigurasi deployment Vercel
├── replit.md                # Dokumentasi project
└── public/
    └── index.html           # Frontend UI (HTML/CSS/JS)
```

## 🚀 API Endpoints

### 1. Download Video/Foto
```
POST /api/download
Body: { "url": "https://www.tiktok.com/@user/video/..." }
Response: Video/photo data dengan download links
```

### 2. Trending Feed
```
GET /api/trending?region=ID&count=30
Response: Array of trending videos
```

### 3. User Feed
```
GET /api/user/:username?count=30&cursor=0
Response: Array of user's videos
```

### 4. Music Feed
```
GET /api/music/:musicId?count=30&cursor=0
Response: Array of videos using that music
```

### 5. Search
```
GET /api/search?keyword=dance&type=video&count=30
Response: Search results
```

### 6. Health Check
```
GET /api/health
Response: API status & features list
```

## 🎨 Fitur UI

- **Dark Theme** - Modern dark gradient design
- **Responsive** - Mobile-friendly layout
- **Tab Navigation** - Easy switching between features
- **Real-time Feedback** - Loading states, error messages
- **Grid Layout** - Beautiful video cards with thumbnails
- **Statistics Display** - Views, likes, comments, shares
- **Copy to Clipboard** - Paste URL button
- **Direct Download** - Open download links in new tab

## 💻 Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm start
```

Server akan berjalan di `http://localhost:5000` atau port yang ditentukan di environment variable `PORT`.

## 🌐 Deployment

### Vercel Deployment

Project ini sudah dikonfigurasi untuk Vercel deployment dengan `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

**Steps untuk deploy:**
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Production: `vercel --prod`

### Environment Variables

Tidak ada environment variable yang required karena menggunakan free API tanpa key.

## 🔧 Konfigurasi

### Port Configuration
Default port: 5000 (bisa di-override dengan `PORT` environment variable)

### Region Options untuk Trending
- `ID` - Indonesia
- `US` - United States
- `JP` - Japan
- `KR` - South Korea
- `TH` - Thailand
- `VN` - Vietnam
- `PH` - Philippines
- `MY` - Malaysia
- `SG` - Singapore

## 📝 Cara Penggunaan

### Download Video/Foto
1. Pilih tab "Download"
2. Paste URL video/foto TikTok
3. Klik "Download"
4. Pilih format yang diinginkan (No WM, HD, Music)

### Lihat Trending
1. Pilih tab "Trending"
2. Pilih region/negara
3. Klik "Lihat Trending"
4. Browse video trending

### User Feed
1. Pilih tab "User Feed"
2. Masukkan username (tanpa @)
3. Klik "Lihat Video User"
4. Browse semua video user tersebut

### Music Feed
1. Pilih tab "Music Feed"
2. Masukkan Music ID (dari URL musik TikTok)
3. Klik "Lihat Video dengan Musik Ini"
4. Browse video dengan musik tersebut

### Search
1. Pilih tab "Search"
2. Masukkan keyword
3. Pilih tipe (Video atau User)
4. Klik "Cari"
5. Browse hasil pencarian

## ⚠️ Limitations & Known Issues

### API Limitations
- Rate limit: ~5,000 requests/day per IP (free tier)
- Response time bervariasi tergantung TikWM server load
- Beberapa video private/restricted mungkin tidak bisa diakses

### Regional Restrictions
- Beberapa konten mungkin tidak tersedia di region tertentu
- Trending feed bervariasi per negara

### Photo/Slideshow Support
- Download foto individual dari slideshow sudah support
- Music extraction dari slideshow post tersedia

## 🔐 Security & Privacy

- Tidak ada data user yang disimpan
- Semua request langsung ke TikWM API
- Tidak memerlukan login TikTok
- Tidak ada tracking/analytics

## 📊 Performance

- **Backend:** Express.js dengan async/await untuk non-blocking I/O
- **Frontend:** Vanilla JS tanpa framework overhead
- **API Calls:** Timeout 15 detik untuk prevent hanging
- **Responsive:** Optimized untuk mobile & desktop

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill existing process
pkill -f "node index.js"
# Restart
npm start
```

### API Error
- Check internet connection
- Verify URL format
- Try different region/content

### Vercel Deploy Error
- Ensure `vercel.json` exists
- Check build logs
- Verify Node.js version (22.x)

## 📅 Version History

### v2.0 (Current)
- ✅ Fokus 100% ke TikTok (removed Instagram & YouTube)
- ✅ Tambah Trending Feed
- ✅ Tambah User Feed
- ✅ Tambah Music Feed
- ✅ Tambah Search functionality
- ✅ Support photo/slideshow download
- ✅ Modern UI dengan tab navigation
- ✅ Vercel deployment ready
- ✅ Responsive grid layout

### v1.0 (Legacy)
- Multi-platform downloader (TikTok, Instagram, YouTube)
- Basic download functionality

## 👨‍💻 Developer Notes

### Code Structure
- **Modular functions** - Setiap fitur punya function sendiri
- **Error handling** - Try-catch di semua async operations
- **Consistent API** - Semua endpoint return `{ success, data/error }`
- **Clean code** - No duplicate, readable, maintainable

### Future Enhancements
- [ ] Pagination untuk load more results
- [ ] Video preview player
- [ ] Batch download multiple videos
- [ ] Download history tracking
- [ ] Dark/Light theme toggle
- [ ] Multi-language support

## 📞 Support & Contact

Untuk bug reports atau feature requests, silakan buat issue di GitHub repository.

## 📄 License

Project ini dibuat untuk educational purposes. Respect TikTok Terms of Service dan content creator rights.

---

**Built with ❤️ using TikWM API**

Last Updated: October 25, 2025
