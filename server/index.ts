import express from 'express';
import env from './env';
import { node, initNode } from './node';

// Configure server
const app = express();


// Routes
app.get('/', async (req, res, next) => {
  try {
    const info = await node.getInfo();
    res.send(`
      <h1>Node info</h1>
      <pre>${JSON.stringify(info, null, 2)}</pre>
    `);
    next();
  } catch(err) {
    next(err);
  }
});


// Initialize node & server
console.log('Initializing Lightning node...');
initNode().then(() => {
  console.log('Lightning node initialized!');
  console.log('Starting server...');
  app.listen(env.PORT, () => {
    console.log(`Server started at http://localhost:${env.PORT}!`);
  });
});
