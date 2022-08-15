const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');
const Post = require('../../models/Post');

// POST api/posts
// Test route
// Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
    const newPost = new Post ({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    });

    const post = await newPost.save();
    res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

    
});

// GET api/posts
// Get all post
// Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET api/posts/:id
// Get post by ID
// Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg: 'Post Not Found'})
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(404).json({msg: 'Post not find'})
        }
        res.status(500).send('Server Error');
    }
});

// DELETE api/posts/:id
// Delete a post
// Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg: 'Post Not Found'})
        }
        // Check user
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not Authorized'});
        }
        await post.remove();

        res.json({msg: 'Post removed'});
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(404).json({msg: 'Post not find'})
        }
        req.status(500).send('Server Error');
    }
});

// PUT api/posts/like/:id
// like a post
// Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // Check if post is already liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({msg: 'Already Liked'});
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        req.status(500).send('Server Error');
    }
});

// PUT api/posts/unlike/:id
// like a post
// Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // Check if post is already liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({msg: 'Not Liked yet'});
        }
        //Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        req.status(500).send('Server Error');
    }
});

// POST api/posts/comment/:id
// Comment on a post
// Private
router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);


        const newComment = ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

    
});

// DELETE api/posts/comment/:id/:comment_id
// Delete Comment on a post
// Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Pull out Comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        // Make sure comment exits
        if(!comment){
            return res.status(404).json({msg: 'Comment Does Not Exist'})
        }

        //Check user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorised'});
        }

        //Get remove index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);



    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;