const express = require('express');
const cors = require('cors');

const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');
const applicationRoutes = require('./routes/application.routes');
const authRoutes = require('./routes/auth.routes');
const campaignRoutes = require('./routes/campaign.routes');
const creatorRoutes = require('./routes/creator.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'AdBridge API is running.',
    docs: {
      health: '/api/health',
      auth: '/api/auth',
      campaigns: '/api/campaigns',
      creators: '/api/creators',
      applications: '/api/applications',
    },
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/applications', applicationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
