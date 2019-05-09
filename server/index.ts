import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Invoice, Readable } from '@radar/lnrpc';
import env from './env';
import { node, initNode } from './node';
import { addPost, getPost, getPaidPosts, markPostPaid } from './posts';

// Configure server
const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());


// Routes
app.get('/api/posts', (req, res) => {
  res.json({ data: getPaidPosts() });
});

app.get('/api/posts/:id', (req, res) => {
  const post = getPost(parseInt(req.params.id, 10));
  if (post) {
    res.json({ data: post });
  } else {
    res.status(404).json({ error: `No post found with ID ${req.params.id}`});
  }
});

app.post('/api/posts', async (req, res, next) => {
  try {
    const { name, content } = req.body;

    if (!name || !content) {
      throw new Error('Fields name and content are required to make a post');
    }

    const post = addPost(name, content);
    const invoice = await node.addInvoice({
      memo: `Lightning Posts post #${post.id}`,
      value: content.length,
      expiry: '120', // 2 minutes
    });

    res.json({
      data: {
        post,
        paymentRequest: invoice.paymentRequest,
      },
    });
  } catch(err) {
    next(err);
  }
});

app.get('/', (req, res) => {
  res.send('You need to load the webpack-dev-server page, not the server page!');
});


// Initialize node & server
console.log('Initializing Lightning node...');
initNode().then(() => {
  console.log('Lightning node initialized!');
  console.log('Starting server...');
  app.listen(env.PORT, () => {
    console.log(`API Server started at http://localhost:${env.PORT}!`);
  });

  // Subscribe to all invoices, mark posts as paid
  const stream = node.subscribeInvoices() as any as Readable<Invoice>;
  stream.on('data', chunk => {
    // Skip unpaid / irrelevant invoice updates
    if (!chunk.settled || !chunk.amtPaidSat || !chunk.memo) return;

    // Extract post id from memo, skip if we can't find an id
    const id = parseInt(chunk.memo.replace('Lightning Posts post #', ''), 10);
    if (!id) return;

    // Mark the invoice as paid!
    markPostPaid(id);
  });
});
