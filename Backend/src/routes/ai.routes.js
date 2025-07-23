const express = require('express')
const router = express.Router();
const aiController = require('../controllers/ai.controller.js')

router.post("https://syntaxsense-ai-frontend.onrender.com/",aiController.getReview)

module.exports = router;
