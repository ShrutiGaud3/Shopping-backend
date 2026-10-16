const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function run() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const categoriesCol = mongoose.connection.collection('categories');

  const lehengaParent = await categoriesCol.findOne({ slug: 'lehengas' });
  const salwarParent = await categoriesCol.findOne({ slug: 'salwar-suits' });
  const sareeParent = await categoriesCol.findOne({ slug: 'sarees' });

  console.log('Saree parent ID:', sareeParent?._id);
  console.log('Lehenga parent ID:', lehengaParent?._id);
  console.log('Salwar parent ID:', salwarParent?._id);

  if (lehengaParent) {
    const res = await categoriesCol.updateMany(
      { slug: { $in: ['bridal-lehengas', 'sangeet-lehengas', 'velvet-lehengas'] } },
      { $set: { parent: lehengaParent._id } }
    );
    console.log('Updated lehenga subcategories parent count:', res.modifiedCount);
  }

  if (salwarParent) {
    const existingSalwarChildren = await categoriesCol.find({ parent: salwarParent._id }).toArray();
    if (existingSalwarChildren.length === 0) {
      await categoriesCol.insertMany([
        {
          name: 'Anarkali Suits',
          slug: 'anarkali-suits',
          gender: 'All',
          image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
          description: '',
          itemCount: 0,
          parent: salwarParent._id,
          order: 1,
          showInMenu: true,
          type: 'category',
          featured: false,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Straight Cut Suits',
          slug: 'straight-cut-suits',
          gender: 'All',
          image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
          description: '',
          itemCount: 0,
          parent: salwarParent._id,
          order: 2,
          showInMenu: true,
          type: 'category',
          featured: false,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Sharara & Gharara Sets',
          slug: 'sharara-gharara-sets',
          gender: 'All',
          image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
          description: '',
          itemCount: 0,
          parent: salwarParent._id,
          order: 3,
          showInMenu: true,
          type: 'category',
          featured: false,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      console.log('Inserted Salwar subcategories!');
    }
  }

  // Verify tree
  const allCats = await categoriesCol.find({}).toArray();
  console.log('\n--- VERIFICATION OF CATEGORIES ---');
  allCats.forEach(c => {
    console.log(`- ${c.name} (slug: ${c.slug}, parent: ${c.parent})`);
  });

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(console.error);
