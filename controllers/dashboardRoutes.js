const router = require('express').Router();

// Import the necessary models
const { User, Post, Comment } = require('../models');

// Import the authentication middleware
const withAuth = require('../utils/auth');

// Define the dashboard route
router.get('/', withAuth, async (req, res) => {
  try {
    // Find all posts created by the logged in user
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      include: [{ model: User, attributes: ['username'] }],
    });

    // Serialize the data
    const posts = postData.map((post) => post.get({ plain: true }));

    // Render the dashboard view with the serialized data
    res.render('dashboard', { posts, loggedIn: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Define the route for creating a new post
router.get('/new', withAuth, (req, res) => {
  res.render('new-post', { loggedIn: true });
});

// Define the route for editing an existing post
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    // Find the post with the specified ID
    const postData = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username'] }],
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    // Serialize the data
    const post = postData.get({ plain: true });

    // Render the edit-post view with the serialized data
    res.render('edit-post', { post, loggedIn: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
