const config = require('./config');
const app = require('./app');

function startServer() {
  const server = app.listen(config.port, () => {
    console.log(`AdBridge API listening on http://localhost:${config.port}`);
  });

  server.on('error', (error) => {
    console.error('Failed to start AdBridge API.', error);
    process.exit(1);
  });

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = {
  startServer,
};
