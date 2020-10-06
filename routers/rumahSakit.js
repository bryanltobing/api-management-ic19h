const express = require('express');
const router = express.Router();

const { RumahSakitModel } = require('./../models/RumahSakit');

router.get('/list', async(req, res) => {
    try {
        const rumahSakit = await RumahSakitModel.find({});
        res.render('rumahSakit/list', {
            rumahSakit
        });
    } catch(e) {
        res.json({
            error : e.message
        })
    }
});

router.get('/list/detail/:id', async(req, res) => {
    try {
        const rumahSakit = await RumahSakitModel.findById(req.params.id);
        res.render('rumahSakit/detail', {
            rumahSakit
        });
    } catch(e) {
        res.json({
            error : e.message
        });
    }
});

router.get('/upload', (req, res) => {
    res.render('rumahSakit/upload');
});

router.get('/update/:id', async (req, res) => {
    try {
        const rumahSakit = await RumahSakitModel.findById(req.params.id);
        res.render('rumahSakit/update', {
            rumahSakit
        });

    } catch(e) {
        res.json({
            error : e.message
        });
    }
});




module.exports = router;