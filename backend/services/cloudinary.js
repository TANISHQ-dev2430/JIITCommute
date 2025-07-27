const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.uploadImage = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'profile_images',
        use_filename: true,
    });
};

module.exports.deleteImage = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId);
};

module.exports.uploadImageStream = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: 'profile_images',
            use_filename: true,
        }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        stream.end(buffer);
    });
};