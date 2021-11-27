const router = require('express').Router();
const User = require("../models/User")
const bcrypt = require('bcryptjs')

//register

router.post("/register", async(req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPasword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPasword,
        });
        const user = await newUser.save();
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }

});
// login
router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("Usuario no encontrado")

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("contraseña erronea");

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json(error)
    }

});

module.exports = router;