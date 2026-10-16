const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function run() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const productsCol = mongoose.connection.collection('products');
  const prods = await productsCol.find({}).toArray();

  for (let i = 0; i < prods.length; i++) {
    await productsCol.updateOne(
      { _id: prods[i]._id },
      {
        $set: {
          isTrending: true,
          isNew: i % 2 === 0,
          isDeal: i % 3 === 0
        }
      }
    );
  }

  console.log(`Updated flags on ${prods.length} products.`);
  await mongoose.disconnect();
}

run().catch(console.error);
