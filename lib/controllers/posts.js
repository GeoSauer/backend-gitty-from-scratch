const { Router } = require('express');
const Post = require('../models/Post.js');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const post = await Post.insert({
      userId: req.user.id,
      content: req.body.content,
    });
    res.json(post);
  } catch (error) {
    next(error);
  }
});
