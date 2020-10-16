const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
const path = require('path');

// set api version
const s3 = new aws.S3( { apiVersion : '2006-03-01' } );
// set uploading method
const upload = multer({
    storage : multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        metadata : (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const fileNameOnly = file.originalname.split('.').slice(0, -1)[0];
            cb(null, `rumahSakitImages/${fileNameOnly}-${uuid()}${ext}` );
        },
    })
});

module.exports = {
    s3,
    upload
}