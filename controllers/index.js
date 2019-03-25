/** Root route and API routes go here */

const User = require('../models/user');

require('@tensorflow/tfjs-node');

const faceapi = require('../public/js/face-api.js');
const canvas  = require('canvas');

const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODELS_URL = 'public/'

module.exports = (app) => {
    // ROOT
    app.get('/', (req, res) => {
        const currentUser = req.user;
        res.render('index', { currentUser });
    });

    // Camera route that renders central app
    app.get('/faceCam', async (req, res) => {
        try {
            // Check for current user
            const currentUser = req.user;

            if (currentUser) {
                var user = await User.findById(currentUser._id)
                    .populate('photo1')
                    .populate('photo2')
                    .populate('photo3')
                    .populate('photo4');
                console.log(user);
                // console.log("Facecam photo", user.photo1.name);
            }

            // Email content
            // const emailSubject = 'Here is your Aurora Selfie!',
            //     emailBody = `
            // Hi there!
            //
            // Here is the selfie that you asked for.`,
            //
            //     emailBody2 = `
            //
            // Check us out again soon at auroramirror.com
            //
            // --Faith and Stephanie`,
            //
            //     mailTo = 'mailto:?subject=' + emailSubject + '&body=' + emailBody + emailBody2;

            const ssd = new faceapi.SsdMobilenetv1();
            const tiny = new faceapi.TinyFaceDetector();

            // console.log(faceapi.nets);
            await ssd.loadFromDisk(MODELS_URL);
            await tiny.loadFromDisk(MODELS_URL);

            // console.log(mailTo);
            res.render('facecam', {
                // mailTo,
                currentUser,
                user
            });

        } catch (err) {
            console.log(err);
        }
    })
};
