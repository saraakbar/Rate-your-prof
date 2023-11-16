const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController'); 
const {auth} = require('../middleware/auth');

router.post('/create_review',auth, reviewController.create);
router.patch('/like/:id',auth, reviewController.like);
router.patch('/dislike/:id',auth, reviewController.dislike);
router.delete('/delete_review/:id',auth, reviewController.delete);

module.exports = router;