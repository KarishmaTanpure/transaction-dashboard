const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const seedDatabase = require('./services/seedDatabase'); 
const transactionRoutes = require('./routes/transactions');
const { DB_URI } = require('./config');

const app = express();


app.use(cors());
app.use(express.json()); 


mongoose.connect(DB_URI)
    .then(() => {
        console.log('Database connected');
        seedDatabase();  
    })
    .catch((err) => console.error('Database connection error:', err));


app.use('/api', transactionRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});


const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
