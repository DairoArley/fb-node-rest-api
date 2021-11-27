const router = require('express').Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User');

//update user
router.put("/:id", async(req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.status(500).json(error)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("La cuenta ha sido actualizada");
        } catch (error) {
            return res.status(500).json(error)
        }

    } else {
        return res.status(403).json("Sólo puedes actulizar tu cuenta");
    }
});
//delete user
router.delete("/:id", async(req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("La cuenta ha sido eliminada");
        } catch (error) {
            return res.status(500).json(error)
        }

    } else {
        return res.status(403).json("Sólo puedes eliminar tu cuenta");
    }
});
//get a user
router.get("/:id", async(req, res) => {
        try {
            const user = await User.findById(req.params.id);
            const { password, updatedAt, isAdmin, ...other } = user._doc
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    })
    //follow a user
router.put("/:id/follow", async(req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("Lo empezaste a seguir");
            } else {
                res.status(403).json("Ya lo sigues");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("No puedes seguirte a ti mismo");
    }
});
//unfollow a user
router.put("/:id/unfollow", async(req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("ya no sigues a el usurio");
            } else {
                res.status(403).json("no sigues al usuario");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("tu no puedes dejar de seguirte a ti mismo");
    }
});

module.exports = router