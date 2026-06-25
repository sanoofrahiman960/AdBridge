const config = require('./config');
const app = require('./app');

app.listen(config.port, () => {
  console.log(`AdBridge API listening on http://localhost:${config.port}`);
});
