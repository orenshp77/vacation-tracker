const https = require('https');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Unsplash source URLs for sample images (free to use)
const images = [
    { name: 'rome.jpg', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80' },
    { name: 'rhodes.jpg', url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80' },
    { name: 'lahaina.jpg', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
    { name: 'corfu.jpg', url: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800&q=80' },
    { name: 'hilo.jpg', url: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800&q=80' },
    { name: 'montego.jpg', url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80' },
    { name: 'santorini.jpg', url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80' },
    { name: 'bali.jpg', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80' },
    { name: 'barcelona.jpg', url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80' },
    { name: 'maldives.jpg', url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80' },
    { name: 'tokyo.jpg', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80' },
    { name: 'paris.jpg', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80' }
];

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(UPLOADS_DIR, filename);
        const file = fs.createWriteStream(filePath);

        const request = (url) => {
            https.get(url, (response) => {
                if (response.statusCode === 301 || response.statusCode === 302) {
                    // Follow redirect
                    request(response.headers.location);
                    return;
                }

                response.pipe(file);

                file.on('finish', () => {
                    file.close();
                    console.log(`Downloaded: ${filename}`);
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlink(filePath, () => {});
                reject(err);
            });
        };

        request(url);
    });
};

const downloadAllImages = async () => {
    console.log('Starting image download...\n');

    for (const image of images) {
        // Only download if file doesn't exist or is too small
        const filePath = path.join(UPLOADS_DIR, image.name);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (stats.size > 1000) {
                console.log(`Skipping ${image.name} (already exists)`);
                continue;
            }
        }

        try {
            await downloadImage(image.url, image.name);
        } catch (error) {
            console.error(`Failed to download ${image.name}:`, error.message);
        }
    }

    console.log('\nImage download complete!');
};

downloadAllImages();
