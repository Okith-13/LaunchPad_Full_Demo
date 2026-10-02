const express = require('express');
const cors = require('cors');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurant.routes');
const menuRoutes = require('./routes/menu.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Restaurant service running on port ${PORT}`);
});