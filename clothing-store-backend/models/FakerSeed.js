const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker"); // Updated import

const Product = require("./Product");
const User = require("./User");
const Order = require("./Order");

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const imageUrls = [
  "https://i.postimg.cc/DwsJYggg/cs606-ylw-a0.webp",
  "https://i.postimg.cc/cLy468qk/fe8eb1c065800b123a422b7abf3e5819.webp",
  "https://i.postimg.cc/FHMPMNLL/815561a57ec37cfa21c13362d809406a.jpg",
  "https://i.postimg.cc/PfWDth8j/the-apricot-solid-button-knit-top-apricot-tops-u8zuyg-999314-650x.webp",
  "https://i.postimg.cc/RCtbT3Jz/5c6588bdd9130fe0a0f1681fbcb62f75.webp",
  ];

const seedProducts = async (num) => {
  const categories = ["Top", "Pants", "Dress"]; // Allowed categories
  const categoryPrefixes = {
    Top: ["ActiveFit™", "PowerFlex™", "LuxeComfort™"],
    Pants: ["FlexWear™", "PerformanceGear™", "Athleisure™"],
    Dress: ["ChicStyle™", "ElegantLine™", "EveningGlam™"],
  };

  const categorySuffixes = {
    Top: ["T-Shirt", "Tank Top", "Blouse"],
    Pants: ["Leggings", "Joggers", "Trousers"],
    Dress: ["Maxi Dress", "Cocktail Dress", "Summer Dress"],
  };

  const sizes = ["S", "M", "L", "XL"]; // Standard sizes

  const products = [];
  for (let i = 0; i < num; i++) {
    const category = faker.helpers.arrayElement(categories); // Randomly select a category
    const prefix = faker.helpers.arrayElement(categoryPrefixes[category]); // Randomly select a prefix
    const suffix = faker.helpers.arrayElement(categorySuffixes[category]); // Randomly select a suffix
    const name = `${prefix} ${suffix}`; // Combine prefix and suffix to form the product name
    const imageUrl = faker.helpers.arrayElement(imageUrls);

    products.push({
      name: name, // Assign the dynamically generated name
      category: category, // Assign the selected category
      price: parseFloat(faker.commerce.price({ min: 20, max: 150 })), // Generate a random price between 20 and 150
      size: faker.helpers.arrayElement(sizes), // Generate a random size
      description: faker.commerce.productDescription(), // Generate a random description
      imageUrl,
    });
  }

  await Product.insertMany(products);
  console.log(`${num} products seeded`);
};


const seedUsers = async (num) => {
  const users = [];
  for (let i = 0; i < num; i++) {
    users.push({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      cart: [],
      orderHistory: [],
    });
  }
  await User.insertMany(users);
  console.log(`${num} users seeded`);
};

const seedOrders = async (num) => {
  const users = await User.find();
  const products = await Product.find();

  if (users.length === 0 || products.length === 0) {
    console.log("Ensure users and products are seeded before running order seeds.");
    return;
  }

  const orders = [];

  for (let i = 0; i < num; i++) {
    const user = faker.helpers.arrayElement(users);
    const selectedProducts = faker.helpers.arrayElements(products, 3);
    const orderProducts = selectedProducts.map((product) => ({
      product: product._id,
      quantity: faker.number.int({ min: 1, max: 5 }),
    }));

    const totalAmount = orderProducts.reduce(
      (sum, item) => sum + item.quantity * products.find((p) => p._id.equals(item.product)).price,
      0
    );

    const order = new Order({
      user: user._id,
      products: orderProducts,
      totalAmount,
      shippingAddress: faker.location.streetAddress(),
      status: faker.helpers.arrayElement(["Ordered", "Delivered", "Cancelled"]),
    });

    await order.save();
    orders.push(order);

    user.orderHistory.push(order._id);
    await user.save();
  }

  console.log(`${num} orders seeded`);
};


const seedDatabase = async () => {
  try {
    await seedProducts(50);
    await seedUsers(20);
    await seedOrders(30);
    mongoose.disconnect();
    console.log("Database populated successfully");
  } catch (err) {
    console.error("Error populating database:", err);
  }
};

seedDatabase();
