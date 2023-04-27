const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Define the homepage route
router.get('/', async (req, res) => {
  try {
    // Find all posts and include the user and comments
    const postData = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }, { model: Comment }],
    });

    // Serialize the data
    const posts = postData.map((post) => post.get({ plain: true }));

    // Render the homepage view with the serialized data
    res.render('homepage', { posts, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Define the login route
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  // Render the login view
  res.render('login');
});

// Define the signup route
router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  // Render the signup view
  res.render('signup');
});

module.exports = router;
