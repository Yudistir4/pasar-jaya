const multer = require('multer');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

const { CloudinaryStorage } = require('multer-storage-cloudinary');

// const storage = multer.diskStorage({
//     destination: function (req,res,cb){
//         cb(null, path.join(__dirname, './uploads'));
//     },
//     filename: function (req,file,cb) {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         const filename = file.originalname.split(".")[0];
//         cb(null,filename + "-" + uniqueSuffix + ".png");
//     },
// });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'epasar', // Optional - specify a folder in Cloudinary to store the files
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Optional - define allowed file formats
  },
});
exports.upload = multer({ storage: storage });
