const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Models
const { RumahSakitModel } = require('./../models/RumahSakit');
const { s3, upload } = require('../function/uploadAWS');

router.post('/upload', upload.array('images'), async(req, res) => {
    const files = req.files.map((file) => {
        return {
            _id : file._id,
            location : file.location,
            key : file.key
        }
    });
    const rumahSakit = new RumahSakitModel({
        ...req.body,
        images : files
    });

    try {
        const rs = await rumahSakit.save();
        res.redirect(`/rumahsakit/list/detail/${rs._id}`);
    } catch(e) {
        res.json({e : e.message});
    }
});


router.post('/delete/:id', async (req, res) => {
    try {
        const rumahSakit = await RumahSakitModel.findOneAndDelete({
            _id : req.params.id
        });
        
        const key = rumahSakit.images.map((rs) =>{
            return {
                Key : rs.key
            }
        });

        const objectData = await s3.deleteObjects({
            Bucket : process.env.BUCKET_NAME,
            Delete : {
                Objects : key,
                Quiet : false
            }
        }).promise();
        res.redirect('/rumahsakit/list');

    } catch(e) {
        res.send({
            error : e.message
        })
    }
});

router.post('/update/:id', upload.array('images'), async (req, res) => {
    try {
        const rumahSakit = await RumahSakitModel.findById(req.params.id);
        if(req.body.name !== '' && req.body.name !== rumahSakit.name) {
            rumahSakit.name = req.body.name;
        }
        if(req.body.address !== '' && req.body.address !== rumahSakit.address) {
            rumahSakit.address = req.body.address;
        }
        if(req.body.region !== '' && req.body.region !== rumahSakit.region) {
            rumahSakit.region = req.body.region;
        }
        if(req.body.province !== '' && req.body.province !== rumahSakit.province) {
            rumahSakit.province = req.body.province;
        }
        if(req.body.phone !== '' && req.body.phone !== rumahSakit.phone) {
            rumahSakit.phone = req.body.phone;
        }
        if(req.files !== undefined) {
            const files = req.files.map((file) => {
                return {
                    _id : new mongoose.mongo.ObjectId(),
                    location : file.location,
                    key : file.key
                }
            });
            rumahSakit.images.push(...files);
        }
        const rumahSakitNew = await rumahSakit.save();
        res.redirect(`/rumahsakit/list/detail/${rumahSakitNew._id}`);
    } catch(e) {
        res.json({
            erro : e.message
        })
    }
});

router.post('/update/gambar/:id/:idgambar', async (req, res) => {
    try {
        const objectImages = await RumahSakitModel.findOne({'images.key' : req.query.key },{ 'images.$' : 1 } );
        await s3.deleteObject({
            Bucket: process.env.BUCKET_NAME, 
            Key: objectImages.images[0].key
        }).promise();
        const images = await RumahSakitModel.updateMany({ },{ $pull: { images: { _id: req.params.idgambar } } });
        res.redirect(`/rumahsakit/update/${req.params.id}`);
    } catch(e) {
        res.json({
            error : e.message
        });
    }
});

module.exports = router;