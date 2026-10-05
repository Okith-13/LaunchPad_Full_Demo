const express = require('express');
const cors = require('cors');
require('dotenv').config();

const customerRoutes = require('./routes/customer.routes');
const addressRoutes = require('./routes/address.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/customers', customerRoutes);
app.use('/api/customers/addresses', addressRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Customer service running on port ${PORT}`);
});