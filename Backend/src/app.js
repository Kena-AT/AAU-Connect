const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic Route
app.get('/', (req, res) => {
  res.send('AAU Connect API is running...');
});

// Route Files
const auth = require('./routes/auth.routes');
const posts = require('./routes/post.routes');
const comments = require('./routes/comment.routes');
const stories = require('./routes/story.routes');
const users = require('./routes/user.routes');
const search = require('./routes/search.routes');

// Mount routes
app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/comments', comments);
app.use('/api/stories', stories);
app.use('/api/users', users);
app.use('/api/search', search);

module.exports = app;
