const express = require('express');
const cors = require('cors');
require('dotenv').config();

const deliveryRoutes = require('./routes/delivery.routes');

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: clientOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Specification required health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'delivery-service' });
});

app.use('/api/deliveries', deliveryRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Delivery service running on port ${PORT}`);
});