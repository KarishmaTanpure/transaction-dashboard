const axios = require('axios');
const Transaction = require('../models/transaction');
const API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

async function seedDatabase() {
  try {
    
    const { data } = await axios.get(API_URL);

    
    await Transaction.deleteMany({});

    
    await Transaction.insertMany(data);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error.message);
  }
}

module.exports = seedDatabase;
