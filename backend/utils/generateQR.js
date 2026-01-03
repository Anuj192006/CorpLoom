const QRCode = require('qrcode');

const generateAssetQR = async (assetId) => {
    try {
        // In a real scenario, you'd upload this to Cloudinary/S3
        // For this implementation, we return a DataURL (base64) 
        // which can be treated as our "URL" for demonstration.
        const qrData = await QRCode.toDataURL(assetId);
        return qrData;
    } catch (err) {
        console.error('QR Generation Error:', err);
        return null;
    }
};

module.exports = { generateAssetQR };
