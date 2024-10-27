const express = require('express');
const {
    getTransactions,
    getStatistics,
    getBarChart,
    getCombinedData  
} = require('../controllers/transactionsController');

const router = express.Router();


router.get('/transactions', getTransactions);
router.get('/transactions/statistics', getStatistics); 
router.get('/transactions/bar-chart', getBarChart);
router.get('/transactions/combined', getCombinedData); 

module.exports = router;
