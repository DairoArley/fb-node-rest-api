const router = require('express').Router();
const Post = require('../models/Post')
    // crear un post
router.post("/", async(req, res) => {
        const newPost = new Post(req.body)
        try {
            const savedPost = await newPost.save();
            res.status(500).json(savedPost)
        } catch (error) {

        }
    })
    // actualizar un post
router.put("/:id", async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (post.userId === req.body.userId) {
                await post.updateOne({ $set: req.body })
                res.status(200).json("post actualizado");
            } else {
                res.status(500).json("usted no puede actualizar elpost de alguien mas")
            }
        } catch (error) {
            res.status(500).json(error);
        }
    })
    // eliminar un post
router.delete("/:id", async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (post.userId === req.body.userId) {
                await post.deleteOne()
                res.status(200).json("post eliminado");
            } else {
                res.status(500).json("usted no puede eliminar el post de alguien mas")
            }
        } catch (error) {
            res.status(500).json(error);
        }
    })
    // like un post
router.put("/:id/like", async(req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post.likes.includes(req.body.userId)) {
                await post.updateOne({ $push: { likes: req.body.userId } });
                res.status(200).json("Le diste me gusta")
            } else {
                await post.updateOne({ $pull: { likes: req.body.userId } });
                res.status(200).json("le diste dislike")
            }
        } catch (error) {
            res.status(500).json(error);
        }

    })
    // get un post
router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error)
    }
});
// get all un post
router.get("/timeline/all", async(req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPost = await Post.find({ userId: currentUser._id });
        const friendPost = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId });
            })
        );
        res.json(userPost.concat(...friendPost))

    } catch (error) {
        res.status(500).json(error)
    }
});


module.exports = router;