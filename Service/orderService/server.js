const express = require('express');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/order.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});