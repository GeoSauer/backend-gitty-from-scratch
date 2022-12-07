const { Router } = require('express');
const Post = require('../models/Post.js');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const posts = await Post.getAll();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  })
  .post('/', async (req, res, next) => {
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
//   .post('/', async (req, res, next) => {
//     try {
//       console.log('something');
//       const post = await Post.insert({
//         githubUserId: req.githubUser.id,
//         content: req.body.content,
//       });
//       console.log('here i am', post);
//       res.json(post);
//     } catch (error) {
//       next(error);
//     }
//   });
